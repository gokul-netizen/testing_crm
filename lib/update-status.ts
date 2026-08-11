


export async function updateDomainStatus(
  ids: number[],
  status: "Active" | "Blocked"
) {
  const res = await fetch("/api/admin-update/domain", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids, status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update status");
  }

  return res.json();
}


 
