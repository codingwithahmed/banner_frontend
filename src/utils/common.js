import SibApiV3Sdk from 'sib-api-v3-sdk'
import { KEYS } from '../config/keys';
export const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
  
      if (provider?.isPhantom) {
        return provider;
      }
    }
}

export const SendEmail = async (
  userMail, message,name
) => {

/*
  try {
    console.log("Email\t",userMail,"\nMessage\t",message,"\nName\t",name)
    const params = {
      method: "POST",
      body : {  
        "sender":{  
           "name":"Ahmed Farooq",
           "email":"banners921@gmail.com"
        },
        "to":[  
           {  
              "email":"aziahmedfarooq@gmail.com",
              "name":"Ahmed Farooq"
           }
        ],
        "subject":"Hello world",
        "htmlContent":"<html><head></head><body><p>Hello,</p>We Have reviced your email Thanks you</p></body></html>"
     },
     headers : {
        'accept' : "application/json",
        'api-key' : "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",
        'content-type' : "application/json",
     }
    }
  
    const res = await fetch('https://api.brevo.com/v3/smtp/email', params )

    console.log(await res.json())
   
  } catch (error) {
    console.log("Error\t",error)
  }

  */

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = KEYS.BREVO_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = "Email Recived";
sendSmtpEmail.htmlContent = '<html><body><h1>Your Email Has Been Recived!</h1></body></html>';
sendSmtpEmail.sender = {"name":"Banners","email":"banners921@gmail.com"};
sendSmtpEmail.to = [{"email":userMail,"name":name}];
//sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
//sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
//sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
sendSmtpEmail.headers = {"content-type":"application/json","accept" : "application/json"};
sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error) {
  console.error(error);
});


sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = "Email From \t"+name;
sendSmtpEmail.htmlContent = '<html><body><h1>Email : '+userMail+' </h1><p>Message : '+message+'</p></body></html>';
sendSmtpEmail.sender = {"email":userMail,"name":name};
sendSmtpEmail.to = [{"name":"Banners","email":"banners921@gmail.com"}];
//sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
//sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
//sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
sendSmtpEmail.headers = {"content-type":"application/json","accept" : "application/json"};
sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error) {
  console.error(error);
});


/* const param = {
    method: "POST",
    body : {  
      "sender":{  
         "name":"Ahmed Farooq",
         "email":userMail
      },
      "to":[  
         {  
            "email":"aziahmedfarooq@gmail.com",
            "name":"Client"
         }
      ],
      "subject":"Sent By ${name}",
      "htmlContent":"<html><head></head><body><h1>${userMail}</h1><p>Hello,</p>${message}</p><h1>${name}</h1></body></html>"
   },
   headers : {
      'accept' : "application/json",
      'api-key' : "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",
      'content-type' : "application/json",
   }
  }
 // const rec = await fetch('https://api.brevo.com/v3/smtp/email', param )

 // console.log("Response\t",await rec.json())

 */

}