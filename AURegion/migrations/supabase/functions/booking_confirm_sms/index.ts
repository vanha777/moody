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
  id: string;
  message_template: string;
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
interface BookingRequest {
  company_id: string;
  feature_id: string;
  booking_id: string;
  campaign_id: string;
}

interface Company {
  id: string;
  name: string;
  identifier: string;
}

interface ContactMethod {
  person_id: string;
  type: string;
  value: string;
}

interface PersonalInformation {
  person_id: string;
  first_name: string;
  last_name: string;
}

interface Customer {
  id: string;
  contact_methods: ContactMethod[];
  personal_information: PersonalInformation;
}

interface Staff {
  id: string;
  personal_information: PersonalInformation;
}

interface BookingDetails {
  id: string;
  customer_id: string;
  staff_id: string;
  booking_date: string;
}

serve(async (req) => {
  try {
    const { company_id, feature_id, booking_id, campaign_id } = await req.json() as BookingRequest;
    
    // Get company details
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id, name, identifier')
      .eq('id', company_id)
      .single();

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError.message}`);
    }

    // Get booking details
    const { data: bookingData, error: bookingError } = await supabase
      .from('booking')
      .select('id, customer_id, staff_id, start_time')
      .eq('id', booking_id)
      .single();

    if (bookingError) {
      throw new Error(`Error fetching booking data: ${bookingError.message}`);
    }

    // Get customer details
    const { data: customerContactMethods, error: contactError } = await supabase
      .from('contact_method')
      .select('person_id, type, value')
      .eq('person_id', bookingData.customer_id)
      .eq('type', 'phone')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (contactError) {
      throw new Error(`Error fetching customer contact methods: ${contactError.message}`);
    }

    const { data: customerPersonalInfo, error: personalInfoError } = await supabase
      .from('personal_information')
      .select('person_id, first_name, last_name')
      .eq('person_id', bookingData.customer_id)
      .single();

    if (personalInfoError) {
      throw new Error(`Error fetching customer personal information: ${personalInfoError.message}`);
    }

    // Get staff details
    const { data: staffPersonalInfo, error: staffPersonalInfoError } = await supabase
      .from('personal_information')
      .select('person_id, first_name, last_name')
      .eq('person_id', bookingData.staff_id)
      .single();

    if (staffPersonalInfoError) {
      throw new Error(`Error fetching staff personal information: ${staffPersonalInfoError.message}`);
    }

    // Get campaign details
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaign')
      .select('id, message_template')
      .eq('id', campaign_id)
      .single();


    if (campaignError) {
      throw new Error(`Error fetching campaign data: ${campaignError.message}`);
    }

    // Format the booking date
    const bookingDate = new Date(bookingData.start_time).toLocaleDateString();
    const staffName = staffPersonalInfo.first_name + " " + staffPersonalInfo.last_name;
    const schedule_link = `https://moosy.vercel.app/booking/jess-glow?booking_id=${booking_id}`
    // Replace placeholders in message template
    let message = campaignData.message_template
      .replace('{first_name}', customerPersonalInfo.first_name || '')
      .replace('{last_name}', customerPersonalInfo.last_name || '')
      .replace('{booking_date}', bookingDate)
      .replace('{business_name}', companyData.name)
      .replace('{staff_name}', staffName)
      .replace('{schedule_link}', schedule_link);

    // Send SMS to the latest phone contact
    if (customerContactMethods) {
      try {
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
              To: customerContactMethods.value,
              Body: cleanMessage,
            }),
          }
        );

        const responseData = await response.json();
        console.log('Twilio response:', responseData);

        if (!response.ok) {
          console.log(`SMS failed to send to ${customerContactMethods.value}`);
          console.log('Error details:', responseData);

          // Insert into feature_usage_history table
          const { error: historyError } = await supabase
            .from('feature_usage_history')
            .insert({
              company_id: company_id,
              recipient_id: bookingData.customer_id,
              campaign_id: campaign_id,
              message_content: cleanMessage,
              recipient: customerContactMethods.value,
              status: false
            });

          if (historyError) {
            console.error(`Failed to insert into feature_usage_history:`, historyError);
          }

          throw new Error(`Twilio API error: ${responseData.message || response.statusText}`);
        }

        if (response.status === 201) {
          console.log(`SMS sent successfully to ${customerContactMethods.value}`);
          console.log('Message sent:', cleanMessage);

          // Insert into feature_usage_history table
          const { error: historyError } = await supabase
            .from('feature_usage_history')
            .insert({
              company_id: company_id,
              recipient_id: bookingData.customer_id,
              campaign_id: campaign_id,
              message_content: cleanMessage,
              recipient: customerContactMethods.value,
              status: true
            });

          if (historyError) {
            console.error(`Failed to insert into feature_usage_history:`, historyError);
          }
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${customerContactMethods.value}:`, error);
      }
    }

    return new Response(JSON.stringify({
      company: companyData,
      booking: bookingData,
      customer: {
        id: bookingData.customer_id,
        contact_method: customerContactMethods,
        personal_information: customerPersonalInfo
      },
      staff: {
        id: bookingData.staff_id,
        personal_information: staffPersonalInfo
      },
      campaign: campaignData,
      formatted_message: message,
      sms_status: "sent"
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