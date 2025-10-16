"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import React, { useState } from "react";
import { Button } from "../ui/button";

// Define the form data interface
interface FormData {
	name: string;
	email: string;
	phoneNumber: string;
	additionalInformation: string;
}

interface FormError {
	message?: string;
}

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
		try {
			setIsSubmitting(true);
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			setSubmitStatus({
				type: "success",
				message: "Message sent successfully! We will get back to you soon.",
			});
			reset();
		} catch {
			setSubmitStatus({
				type: "error",
				message: "Failed to send message. Please try again later.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-12 font-paragraph-semibold leading-relaxed font-in text-base xs:text-lg sm:text-xl"
			>
				Hello, my name is
				<input
					type="text"
					placeholder="Full Name"
					{...register("name", { required: "Name is required" })}
					className="outline-none border-0 p-0 focus:ring-0 text-center placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
				/>
				. I&apos;d love to get in touch with y&apos;all. You can email me at
				<input
					type="email"
					placeholder="your@email.com"
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					})}
					className="outline-none border-0 p-0 focus:ring-0 text-center placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
				/>
				or reach out to me on
				<input
					type="tel"
					placeholder="Phone Number"
					{...register("phoneNumber", { required: "Phone number is required" })}
					className="outline-none border-0 p-0 focus:ring-0 text-center placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
				/>
				. Some additional information on what I want to discuss:
				<br />
				<textarea
					{...register("additionalInformation", {
						required: "Please provide some information",
					})}
					rows={3}
					placeholder="Some additional information..."
					className="w-full outline-none border-0 p-0 focus:ring-0 placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
				/>
				<div className="w-full flex flex-col items-center md:items-start gap-4 mt-8">
					<Button
						type="submit"
						variant={"default"}
						className="text-cream-50 font-paragraph-semibold px-4"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Sending..." : "Submit"}
					</Button>

					{submitStatus.type && (
						<div
							className={`text-sm ${
								submitStatus.type === "success"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							{submitStatus.message}
						</div>
					)}

					{Object.keys(errors).length > 0 && (
						<div className="text-red-600 text-sm">
							{Object.values(errors).map((error: FormError, index) => (
								<p key={index}>{error.message}</p>
							))}
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
