import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required to reset the password." }, { status: 400 });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http:localhost:3000/reset-password"
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Password reset email sent successfully." }, { status: 200 });
}
