  if (!response.ok) {
    throw new Error(`Twilio API error: ${response.statusText}`);
  }
  
  console.log(`SMS sent successfully to ${booking.phone}`);

  // Update feature_usage_history table
  const { error: historyError } = await supabase
    .from('feature_usage_history')
    .insert({
      company_id: campaign.company_id,
      recipient_id: booking.customer_id,
      campaign_id: campaign.campaign_id,
      message_content: message,
      recipient: booking.phone,
      status: true,
      sent_at: new Date().toISOString()
    });

  if (historyError) {
    console.error(`Failed to update history for ${booking.phone}:`, historyError);
  }

  // Type assertion to fix the 'Argument of type 'any' is not assignable to parameter of type 'never'' error
  result = response;
} catch (error) {
  console.error(`Error sending SMS:`, error);
  result = null;
} 