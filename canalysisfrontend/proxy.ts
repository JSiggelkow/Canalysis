import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function proxy(request: NextRequest) {

    if(request.nextUrl.pathname.startsWith('/api/ai')) return NextResponse.next()
    if(request.nextUrl.pathname.startsWith('/api/file')) return NextResponse.next()

    const backendHost = process.env.BACKEND_HOST || 'localhost';

    const targetUrl = new URL(
        request.nextUrl.pathname + request.nextUrl.search,
        `http://${backendHost}:8080`
    );

    return NextResponse.rewrite(targetUrl);
}

export const config = {
    matcher: '/api/:path*',
}