 
import { redirect } from "next/navigation";
export default async function loginAction(formData: FormData) {
    //  get data of form
    const username = formData.get("username");
    const password = formData.get("password");

    // post the data
    const res = await fetch("/api/admin_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if(res.ok){
        redirect("/dashboard");
    }
}