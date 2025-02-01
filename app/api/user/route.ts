import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nickname, phone_num, website, avatar_url, userId } = body;

        const fieldsToUpdate: Record<string, string> = {};

        if (nickname) fieldsToUpdate.nickname = nickname;
        if (phone_num) fieldsToUpdate.phone_num = phone_num;
        if (website) fieldsToUpdate.website = website;
        if (avatar_url) fieldsToUpdate.avatar_url = avatar_url;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return NextResponse.json(
                { message: "No fields to update." },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("users")
            .update(fieldsToUpdate)
            .eq("id", userId);

        if (error) {
            return NextResponse.json(
                { message: `Error updating user data: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "User data updated successfully.", data });
    } catch (error) {
        return NextResponse.json(
            { message: "An unexpected error occurred.", error: String(error) },
            { status: 500 }
        );
    }
}
