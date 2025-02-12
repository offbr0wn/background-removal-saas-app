# Background Removal SaaS App

A SaaS application that allows users to remove image backgrounds using advanced AI-powered technology. Built with Next.js on the frontend and Hono on the backend, this project integrates with AWS S3 for file storage, Clerk for authentication, and Stripe for payment processing.

## Features

- **AI-Powered Background Removal:** Automatically remove backgrounds from images with advanced AI.
- **User Authentication:** Secure sign-up and login using Clerk.
- **Responsive Design:** Seamlessly works on both desktop and mobile devices.
- **Cloud Storage:** Directly upload images to AWS S3 and process them.
- **Payment Integration:** Seamlessly handle subscriptions and payments with Stripe.

## Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Hono
- **Cloud Storage:** AWS S3
- **Authentication:** Clerk
- **Payment Processing:** Stripe
- **Image Processing:** AI-based background removal

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/offbr0wn/background-removal-saas-app.git
   cd background-removal-saas-app

    npm install
    # or
    yarn install

2. **Set Up Environment Variables**

    - Create a .env.local file in the root directory and add the following (adjust with your own values):
  
     ```bash
      NEXT_PUBLIC_API_BASE_URL=your_base_url
      AWS_ACCESS_KEY_ID=your_aws_access_key_id
      AWS_SECRET_ACCESS_KEY=your_aws_secret_key
      AWS_S3_BUCKET_NAME=_your_aws_bucket_name
      CLAD_API_URL=clad_api_url
      CLAD_API_TOKEN=your_clad_api_token

3. **Run the Development Server**

   ```bash
    npm run dev
    # or
    yarn dev
   
  The application will be available at http://localhost:3000.

## Deployment
 This project is deployed on Vercel. You can view the live site at https://background-removal-saas-app.vercel.app/.



## Contributing
  Contributions are welcome! Please fork the repository and open a pull request with your changes. Before making major changes, open an issue to discuss them.



