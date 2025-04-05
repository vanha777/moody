import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "";
const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "";
const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER") ?? "";
// Define the Campaign type based on the data structure from the SQL function
interface Campaign {
  campaign_id: string;
  message_template: string;
  trigger_frequency: number;
  company_id: string;
  feature_name: string;
  feature_id: string;
}

interface Booking {
  customer_id: string;
  booking_date: string;
  booking_count: number;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
}

// Define the request payload type
interface CampaignRequest {
  campaigns: Campaign[];
}

serve(async (req) => {

  try {
    const { campaigns } = await req.json() as CampaignRequest;
    let result;
    let bookings;
    console.log("THIS IS CAMPAIGNS", campaigns);
    // Loop through each campaign and check feature usage cap
    for (const campaign of campaigns) {
      const { data: usageCheck, error: usageError } = await supabase
        .rpc('check_feature_usage_cap', {
          p_company_id: campaign.company_id,
          p_feature_name: campaign.feature_name
        });
      if (usageError) {
        throw new Error(`Error checking feature usage cap: ${usageError.message}`);
      }
      if (!usageCheck.is_within_cap) {
        throw new Error(`Feature usage cap exceeded for company ${campaign.company_id} and feature ${campaign.feature_name}`);
      }

      // Example queries for different frequencies:
      // If today is 2024-04-05:
      // Frequency 5: start_date = 2024-03-31 00:00:00, end_date = 2024-03-31 23:59:59
      // Frequency 7: start_date = 2024-03-29 00:00:00, end_date = 2024-03-29 23:59:59
      // Frequency 14: start_date = 2024-03-22 00:00:00, end_date = 2024-03-22 23:59:59

      // Get customer bookings for the company within frequency & filter out the ones that have already been sent
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - campaign.trigger_frequency);

      // Set start date to beginning of target day
      const startDate = new Date(targetDate);
      startDate.setUTCHours(0, 0, 0, 0);

      // Set end date to end of target day
      const endDate = new Date(targetDate);
      endDate.setUTCHours(23, 59, 59, 999);

      // console.log(`Querying bookings for company ${campaign.company_id}`);
      // console.log(`Frequency: ${campaign.trigger_frequency} days`);
      // console.log(`Target date: ${targetDate.toISOString().split('T')[0]}`);
      // console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

      const { data: bookingData, error: bookingError } = await supabase
        .rpc('get_customer_bookings_by_company_and_date', {
          p_company_id: campaign.company_id,
          p_start_date: startDate.toISOString(),
          p_end_date: endDate.toISOString()
        }) as { data: Booking[] | null, error: any };

      if (bookingError) {
        throw new Error(`Error fetching customer bookings: ${bookingError.message}`);
      }

      bookings = bookingData;

      // Send SMS to all bookings with phone numbers
      if (bookings && bookings.length > 0) {
        // Get business name from companies table
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('name, review_link, identifier')
          .eq('id', campaign.company_id)
          .single();

        if (companyError) {
          console.error(`Failed to fetch company data:`, companyError);
          continue;
        }

        const businessName = companyData?.name || '';
        const reviewLink = companyData?.review_link || '';
        const identifier = companyData?.identifier || '';
        const bookingLink = `https://moosy.vercel.app/booking/${identifier}`;
        for (const booking of bookings) {
          if (booking.phone) {
            try {
              // Replace placeholders in message template with actual values
              const message = campaign.message_template
                .replace('{first_name}', booking.first_name || '')
                .replace('{last_name}', booking.last_name || '')
                .replace('{booking_date}', booking.booking_date)
                .replace('{business_name}', businessName)
                .replace('{review_link}', reviewLink)
                .replace('{booking_link}', bookingLink);

                const cleanMessage = message
                .trim()
                .replace(/\n+/g, ' ')           // Replace newlines with spaces
                .replace(/\s+/g, ' ')           // Collapse multiple spaces
                .replace(/[^\x20-\x7E]/g, '');  // Remove non-ASCII characters (optional)

              // Send SMS via Twilio REST API
              const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
                {
                  method: "POST",
                  headers: {
                    "Authorization": "Basic " + btoa(`${twilioSid}:${twilioToken}`),
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    From: twilioPhone,
                    To: booking.phone,
                    Body: cleanMessage,
                  }),
                }
              );

              if (!response.ok) {
                console.log(`SMS failed to sent to ${booking.phone}`);

                // Insert into feature_usage_history table
                const { error: historyError } = await supabase
                  .from('feature_usage_history')
                  .insert({
                    company_id: campaign.company_id,
                    recipient_id: booking.customer_id,
                    campaign_id: campaign.campaign_id,
                    message_content: message,
                    recipient: booking.phone,
                    status: false
                  });
                throw new Error(`Twilio API error: ${response.statusText}`);
              }
              // Type assertion to fix the 'Argument of type 'any' is not assignable to parameter of type 'never'' error

              if (response.status === 201) {
                console.log(`SMS sent successfully to ${booking.phone}`);

                // Insert into feature_usage_history table
                const { error: historyError } = await supabase
                  .from('feature_usage_history')
                  .insert({
                    company_id: campaign.company_id,
                    recipient_id: booking.customer_id,
                    campaign_id: campaign.campaign_id,
                    message_content: message,
                    recipient: booking.phone,
                    status: true
                  });

                if (historyError) {
                  console.error(`Failed to insert into feature_usage_history:`, historyError);
                }

              }
            } catch (error) {
              console.error(`Failed to send SMS to ${booking.phone}:`, error);
            }
          }
        }
      }
    }
    return new Response(JSON.stringify({
      result: result,
      bookings: bookings,
      number_of_campaigns: campaigns.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});