import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "./Hero/Hero";
import { Skeleton } from "@/components/ui/skeleton";

// Reason: Lazy load heavy components below the fold to improve initial page load performance
// Using dynamic imports without ssr: false for better Next.js 15 compatibility
const Parallax = dynamic(() => import("./Parallax"), {
	loading: () => <div className="w-screen h-screen bg-cream-100" />,
});

const ProductFeatures = dynamic(
	() => import("./ProductFeatures/ProductFeatures"),
	{
		loading: () => (
			<div className="relative m-5">
				<div className="max-w-screen-xl mx-auto">
					<div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
						<Skeleton className="h-16 w-96 mx-auto" />
					</div>
					<div className="flex flex-col gap-10">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="py-10 lg:py-16">
								<div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12">
									<Skeleton className="h-80 w-full max-w-[400px]" />
									<div className="flex-1 space-y-4">
										<Skeleton className="h-12 w-3/4" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-5/6" />
										<Skeleton className="h-4 w-4/6" />
										<Skeleton className="h-10 w-32" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		),
	}
);

const AppFeatures = dynamic(() => import("./AppFeatures/AppFeatures"), {
	loading: () => (
		<div className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden">
			<div className="max-w-screen-xl mx-auto space-y-8">
				<div className="flex flex-col sm:flex-row items-center gap-8">
					<Skeleton className="h-24 w-72" />
					<Skeleton className="h-20 w-64" />
				</div>
				<div className="flex flex-wrap justify-center gap-5 sm:gap-8">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="w-full sm:w-[30%] h-64 border rounded-lg p-4 space-y-4"
						>
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
							<Skeleton className="h-10 w-full" />
						</div>
					))}
				</div>
			</div>
		</div>
	),
});

const Homepage = () => {
	return (
		<>
			<section id="Home" className=" w-full">
				<Hero />
			</section>

			<Suspense fallback={<div className="w-screen h-screen bg-cream-100" />}>
				<section>
					<Parallax type={"product"} />
				</section>
			</Suspense>

			<Suspense
				fallback={
					<div className="relative m-5">
						<div className="max-w-screen-xl mx-auto">
							<div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
								<Skeleton className="h-16 w-96 mx-auto" />
							</div>
							<div className="flex flex-col gap-10">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="py-10 lg:py-16">
										<div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12">
											<Skeleton className="h-80 w-full max-w-[400px]" />
											<div className="flex-1 space-y-4">
												<Skeleton className="h-12 w-3/4" />
												<Skeleton className="h-4 w-full" />
												<Skeleton className="h-4 w-5/6" />
												<Skeleton className="h-4 w-4/6" />
												<Skeleton className="h-10 w-32" />
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				}
			>
				<section id="ProductFeatures">
					<ProductFeatures />
				</section>
			</Suspense>

			<Suspense fallback={<div className="w-screen h-screen bg-cream-100" />}>
				<section>
					<Parallax type={"app"} />
				</section>
			</Suspense>

			<Suspense
				fallback={
					<div className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden">
						<div className="max-w-screen-xl mx-auto space-y-8">
							<div className="flex flex-col sm:flex-row items-center gap-8">
								<Skeleton className="h-24 w-72" />
								<Skeleton className="h-20 w-64" />
							</div>
							<div className="flex flex-wrap justify-center gap-5 sm:gap-8">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="w-full sm:w-[30%] h-64 border rounded-lg p-4 space-y-4"
									>
										<Skeleton className="h-6 w-3/4" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-5/6" />
										<Skeleton className="h-4 w-4/6" />
										<Skeleton className="h-10 w-full" />
									</div>
								))}
							</div>
						</div>
					</div>
				}
			>
				<section id="AppFeatures">
					<AppFeatures />
				</section>
			</Suspense>
		</>
	);
};

export default Homepage;
