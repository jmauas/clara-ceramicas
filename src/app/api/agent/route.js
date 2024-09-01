import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.socket.remoteAddress;
        const userAgent = req.headers.get('user-agent');
        return NextResponse.json({
            agent: userAgent,
            ip: ip,
            ok: true
        });
    } catch (error) {
      console.log(error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
