"use client";

import Form from "next/form";
import React from "react";

// // Define the form data interface
// interface FormData {
//   name: string; // Name of the user
//   email: string; // Email of the user
//   phoneNumber: string; // Phone number of the user
//   additionalInformation: string; // Additional information from the user
// }

// Define the ContactForm functional component
export default function ContactForm() {
  // const {
  //   register, // Function to register input fields
  //   handleSubmit, // Function to handle form submission
  //   formState: { errors }, // Object to hold form validation errors
  // } = useForm<FormData>();

  // // Define the form submission handler
  // const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  // console.log(errors);

  return (
    // Form container
    <Form
      action={"https://formspree.io/f/xnqoqzqk"}
      // onSubmit={handleSubmit(onSubmit)}
      className="mt-12 font-medium leading-relaxed font-in text-base xs:text-lg sm:text-xl"
    >
      {/* Name input field */}
      Hello, my name is
      <input
        type="text"
        placeholder="Full Name"
        // {...register("name", { required: true, maxLength: 80 })}
        className="outline-none border-0 p-0 focus:ring-0 text-center placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      . I&apos;d love to get in touch with y&apos;all. You can email me at
      {/* Email input field */}
      <input
        type="email"
        placeholder="your@email.com"
        // {...register("email", { required: true, maxLength: 80 })}
        className="outline-none border-0 p-0 focus:ring-0 text-center placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      or reach out to me on
      {/* Phone number input field */}
      <input
        type="tel"
        placeholder="Phone Number"
        // {...register("phoneNumber", { required: true, maxLength: 80 })}
        className="outline-none border-0 p-0 focus:ring-0 text-center placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      . Some additional information on what I want to discuss:
      <br />
      {/* Additional information textarea */}
      <textarea
        // {...register("additionalInformation", {})}
        rows={3}
        placeholder="Some additional information..."
        className="w-full outline-none border-0 p-0 focus:ring-0 placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      {/* Submit button */}
      <div className="w-full flex justify-center md:justify-start mt-8">
        <input
          type="submit"
          value="Submit"
          className="font-medium inline-block capitalize border-2 border-solid rounded-lg cursor-pointer hover:scale-105 transition-all ease duration-300 px-6 sm:px-8 py-2 sm:py-3 text-lg sm:text-xl border-dark dark:border-light"
        />
      </div>
    </Form>
  );
}
