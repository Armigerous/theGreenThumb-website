import Link from "next/link";
import React from "react";

const Conclusion: React.FC = () => {
	return (
		<section className="py-12 bg-cream-200 rounded-lg shadow-xl">
			<div className="mx-auto px-4 text-center">
				<h2 className="text-2xl md:text-3xl font-title-bold text-primary mb-4">
					Stay Connected
				</h2>
				<p className="text-lg md:text-xl text-cream-800 mb-6">
					Have questions or want to learn more about GreenThumb? We&apos;d love
					to hear from you!
				</p>
				<Link
					href="/contact"
					className="text-green-900 text-sm sm:text-base md:text-lg font-normal underline underline-offset-2 hover:text-green-700 transition-colors"
				>
					Reach out to us here
				</Link>
			</div>
		</section>
	);
};

export default Conclusion;
