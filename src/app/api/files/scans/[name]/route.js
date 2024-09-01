import { NextResponse } from "next/server";
import fs from 'fs/promises'
import path from 'path';

export async function GET( req, { params }) {
    const name = params.name;
    const root = process.cwd();
    const imgPath = path.join(root, 'locales', 'scans', name);
    const data = await fs.readFile(imgPath)   
    let ext = name.substr(name.lastIndexOf('.')+1);
    return new NextResponse(
        data,
        {
            status: 200,
            headers: {
                "Content-Type": `.${ext}`,
            }
        }
    )   
}