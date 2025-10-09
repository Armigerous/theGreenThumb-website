import React from "react";

/**
 * PaperTexture Component
 *
 * Reason: Creates SVG-based cold-press paper grain texture overlay
 * for achieving the pastel-gouache aesthetic throughout the garden UI
 */

type PaperTextureProps = {
	opacity?: number;
	className?: string;
};

export const PaperTexture: React.FC<PaperTextureProps> = ({
	opacity = 0.35,
	className = "",
}) => {
	return (
		<div
			className={`pointer-events-none absolute inset-0 ${className}`}
			style={{ opacity }}
			aria-hidden="true"
		>
			<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
				<defs>
					{/* Reason: Cold-press paper grain using turbulence filter */}
					<filter id="paper-grain">
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.9"
							numOctaves="4"
							result="noise"
						/>
						<feColorMatrix
							type="saturate"
							values="0"
							in="noise"
							result="desaturatedNoise"
						/>
						<feComponentTransfer in="desaturatedNoise" result="grain">
							<feFuncA type="discrete" tableValues="1 0" />
						</feComponentTransfer>
						<feBlend mode="multiply" in="SourceGraphic" in2="grain" />
					</filter>

					{/* Reason: Subtle speckle dust layer for gouache authenticity */}
					<filter id="paper-speckles">
						<feTurbulence
							type="fractalNoise"
							baseFrequency="2"
							numOctaves="2"
							seed="7"
							result="speckleNoise"
						/>
						<feColorMatrix
							in="speckleNoise"
							type="matrix"
							values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 -1.5 1.5"
							result="speckles"
						/>
						<feComposite operator="over" in="SourceGraphic" in2="speckles" />
					</filter>
				</defs>

				{/* Reason: Apply paper texture as full-coverage rect */}
				<rect
					width="100%"
					height="100%"
					fill="white"
					filter="url(#paper-grain)"
					opacity="0.4"
				/>

				{/* Reason: Apply subtle speckle overlay */}
				<rect
					width="100%"
					height="100%"
					fill="white"
					filter="url(#paper-speckles)"
					opacity="0.08"
				/>
			</svg>
		</div>
	);
};
