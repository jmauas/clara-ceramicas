import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { options } from '@/src/app/api/auth/[...nextauth]/options.js';
import { subscribirse } from '@/src/services/webNotificacion/webNotification.js';

export async function POST(request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    const subscription = await request.json();

    const res = await subscribirse(subscription, user);      
    
    return NextResponse.json({
      message: res.message ,
      success: res.ok
    }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
