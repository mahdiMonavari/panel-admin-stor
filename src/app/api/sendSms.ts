type RequestBodyType = {
  code : string,
  attributes: { code: number},
  recipient : string,
  line_number : string,
  number_format : string,
}


export default async function sendSms (API_KEY :string, requestBody : RequestBodyType) : Promise<boolean>{
  const res = await fetch("https://api.iranpayamak.com/ws/v1/sms/pattern", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Api-Key": API_KEY,
    Accept: "application/json",
  },
  body: JSON.stringify(requestBody),
});
const data = await res.json()

return data.status === "success";
}


