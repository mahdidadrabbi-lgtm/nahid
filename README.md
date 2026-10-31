# RUAA Store — Project Handover

এই নথিতে RUAA Store-এর project location, GitHub/Vercel/Firebase/Cloudflare সংযোগ, দরকারি link, deployment এবং security তথ্য এক জায়গায় রাখা হয়েছে।

## ১. Project পরিচিতি

| বিষয় | তথ্য |
|---|---|
| Local project folder | `C:\Users\rayhanur\Desktop\ruaa store` |
| GitHub repository | [mahdidadrabbi-lgtm/nahid](https://github.com/mahdidadrabbi-lgtm/nahid) |
| Git branch | `main` |
| Vercel team/account slug | `kestuclose-2930` |
| Vercel project | [nahid](https://vercel.com/kestuclose-2930/nahid) |
| Live storefront / Production domain | [https://ruaaborqa.vercel.app](https://ruaaborqa.vercel.app) |

প্রকল্পটি কম্পিউটারের local folder, GitHub repository এবং Vercel deployment—এই তিন জায়গায় আছে। কম্পিউটার নষ্ট বা folder মুছে গেলে GitHub থেকে code আবার clone করা যাবে; live site Vercel-এ deploy থাকে।

## ২. দরকারি dashboard ও public link

- **Storefront:** [ruaaborqa.vercel.app](https://ruaaborqa.vercel.app)
- **Order tracking:** [ruaaborqa.vercel.app/track](https://ruaaborqa.vercel.app/track)
- **Admin dashboard:** [ruaaborqa.vercel.app/sys-portal-mgt-v2](https://ruaaborqa.vercel.app/sys-portal-mgt-v2)
- **GitHub code:** [mahdidadrabbi-lgtm/nahid](https://github.com/mahdidadrabbi-lgtm/nahid)
- **Vercel project/settings:** [nahid project](https://vercel.com/kestuclose-2930/nahid)
- **Vercel environment variables:** [Project Environment Variables](https://vercel.com/kestuclose-2930/nahid/settings/environment-variables)
- **Cloudflare Turnstile widget:** [widget settings](https://dash.cloudflare.com/cfa0734eee887d2a3b18302dce00ddf5/turnstile/widget/0x4AAAAAAFseiCzmXjlcR7DX/edit)
- **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com/)
- **Meta Events Manager:** [business.facebook.com/events_manager2](https://business.facebook.com/events_manager2/)

Admin dashboard-এর login password এখানে লেখা নেই। নিরাপত্তার জন্য কোনো password, Firebase service-account JSON, JWT secret, বা Turnstile secret এই নথি, chat, GitHub, কিংবা browser code-এ রাখা যাবে না।

## ৩. কোন service কী কাজে লাগে

- **GitHub:** project source code ও version history রাখে।
- **Vercel:** `public/` storefront serve করে এবং `api/` serverless functions চালায়। Production domain `ruaaborqa.vercel.app`।
- **Firebase Cloud Firestore:** server-side API দিয়ে orders ও store settings সংরক্ষণ করে। Browser সরাসরি Firestore access করে না।
- **Cloudflare Turnstile:** checkout-এ automated abuse ঠেকানোর security check। Production hostname `ruaaborqa.vercel.app`; backend token-এর `order` action ও hostname যাচাই করে।
- **Meta Pixel:** browser-side campaign/conversion events পাঠায়। Pixel ID `1338895321203100`; এটি public browser identifier, password নয়।

### Firebase account/project

Firebase Console-এর link জানা আছে, কিন্তু এই handover তৈরির সময় প্রকৃত Firebase Google account-এর email বা Firebase project ID স্বাধীনভাবে নিশ্চিত করা যায়নি। Vercel Production-এ `FIREBASE_SERVICE_ACCOUNT` configured আছে; credential-এর গোপন JSON থেকে project/account তথ্য এখানে কপি করা হয়নি। Firebase Console-এ সঠিক Google account দিয়ে sign in করে project নির্বাচন করুন। Project খুঁজে না পেলে Firebase service account-এর owner/admin-এর সঙ্গে যোগাযোগ করুন।

## ৪. Vercel Production environment variables

Vercel Production-এ নিচের পাঁচটি variable configured আছে। Dashboard-এ secret value hidden থাকবে—এটাই প্রত্যাশিত।

| Variable | ব্যবহার |
|---|---|
| `ADMIN_PASSWORD` | Admin dashboard login |
| `JWT_SECRET` | Signed admin API session |
| `FIREBASE_SERVICE_ACCOUNT` | Server-side Firebase/Firestore access |
| `TURNSTILE_SITE_KEY` | Browser-এ Turnstile widget দেখানো |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile Siteverify |

গোপন মান বদলাতে Vercel project-এর **Settings → Environment Variables** খুলুন, সঠিক variable update করুন এবং Production redeploy করুন। Secret value chat-এ পাঠাবেন না, terminal output-এ print করবেন না, `.env.local` বা `.env` GitHub-এ push করবেন না। `.env.example` শুধু placeholder-এর নমুনা।

## ৫. Deploy ও local development

`main` branch-এ GitHub push হলে Vercel Production deployment তৈরি হয়। Vercel dashboard-এ deployment **Ready** কিনা ও production alias ঠিক আছে কিনা দেখে নিন।

Local development-এর জন্য Node.js 20+ ও npm লাগবে:

```powershell
npm install
npm test
npx vercel link
npx vercel env pull .env.local
npm run vercel:dev
```

`.env.local` কেবল local machine-এ রাখুন; Git-এ commit করবেন না। Project import/build settings ও API configuration-এর বিস্তারিত এই repository-তেই আছে: [vercel.json](./vercel.json), [firebase.json](./firebase.json), [firestore.rules](./firestore.rules), এবং [package.json](./package.json)।

## ৬. Order ও admin ব্যবহারের নোট

- Checkout order তৈরি করতে Production Turnstile verification প্রয়োজন।
- Admin dashboard খোলা থাকলে নতুন order-এর update প্রতি ১০ সেকেন্ডে refresh হয়। Browser notification/sound browser থেকে অনুমতি দিলে কাজ করে।
- Customer order dashboard-এ যাচ্ছে—ব্যবহারকারীর নিশ্চিতকরণ অনুযায়ী এই flow কাজ করছে।
- আগের automated browser test-এ Cloudflare `300030` challenge failure দেখা গিয়েছিল; এটি automated browser-এর ফল, customer order flow ব্যর্থ হওয়ার প্রমাণ নয়।
- Firestore rules deny-by-default: browser থেকে সরাসরি read/write বন্ধ।
- Local server-এর JSON data Production Firestore-এ স্বয়ংক্রিয়ভাবে migrate হয় না।

## ৭. বর্তমান সীমাবদ্ধতা ও পরবর্তী setup

- **Courier booking:** Pathao/Steadfast live booking integration ও provider credentials এখনো নেই; API parcel booking হয়েছে বলে ভান না করে `503` দেয়।
- **Meta Conversions API:** configured নয়। Paid campaign-এর আগে Meta Events Manager-এ Pixel ID ও incoming events পরীক্ষা করুন।
- **Firebase Analytics:** বর্তমানে disabled; চালু করতে Firebase Project settings থেকে সঠিক Web app config নিয়ে আলাদা করে configure করতে হবে।
- **Test order:** test order দিলে dashboard-এ যাচাই করে পরে delete করুন।
- **Ads:** ad approval Meta-র review-এর ওপর নির্ভরশীল। অল্প budget দিয়ে শুরু করে ad link, mobile checkout, order dashboard এবং conversion events নজরে রাখুন।

## ৮. Security ও data safety

- Admin password, `JWT_SECRET`, Firebase service-account JSON এবং Turnstile secret কখনো public করবেন না।
- কোনো secret ভুল করে প্রকাশিত হলে সেটি সংশ্লিষ্ট provider-এ rotate করুন, তারপর Vercel-এ update করে redeploy করুন।
- Admin password ভুলে গেলে Vercel Environment Variables-এ নতুন `ADMIN_PASSWORD` দিন এবং redeploy করুন; password নথিতে লিখে রাখবেন না।
- Firestore data-এর backup/retention Firebase Console থেকে পরিচালনা করুন। GitHub-এ customer order data রাখা হয় না।
- এই document-এ কেবল dashboard-এর link ও public configuration identifier আছে; কোনো login credential বা secret value নেই।

## ৯. Project files

- [API](./api/) — serverless backend ও order/admin endpoints
- [Storefront](./public/) — customer-facing pages, assets, browser code
- [Tests](./test/) — automated tests; চালাতে `npm test`
- [Environment template](./.env.example) — placeholder মাত্র, secret নয়
