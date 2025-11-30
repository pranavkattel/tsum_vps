import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { oid, amt, refId } = await req.json();

    // Verify payment with eSewa
    const verificationUrl = 'https://uat.esewa.com.np/epay/transrec'; // Use production URL for live
    const formData = new FormData();
    formData.append('amt', amt);
    formData.append('rid', refId);
    formData.append('pid', oid);
    formData.append('scd', Deno.env.get('ESEWA_SECRET_KEY') || '');

    const response = await fetch(verificationUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.text();
    const success = result.includes('Success');

    return new Response(
      JSON.stringify({ success, message: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});