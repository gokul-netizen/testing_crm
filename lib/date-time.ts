 
export function getCurrentUTCFromIST() {
  
  const now = new Date();
  
  const nowIST = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const utcForDB = new Date(nowIST.getTime() - nowIST.getTimezoneOffset() * 60000);

  return utcForDB;
}
