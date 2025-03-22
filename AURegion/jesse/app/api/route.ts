import { NextResponse } from 'next/server'
 
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle your POST request here
    console.log('Received POST request:', body)
    
    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error processing request' }, { status: 400 })
  }
}