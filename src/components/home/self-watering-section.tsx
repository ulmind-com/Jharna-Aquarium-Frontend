/* Explainer bands ("About Self-Watering Planters" and "About a Healthy Aquarium")
   with a large hero photo and numbered "How it works" step cards. */

const WATERING_ART_DIR = "/Watering%20Planters";

export interface SelfWateringStep {
  id: string;
  image: string;
  caption: string;
}

export type CareExplainerStep = SelfWateringStep;

const defaultSteps: CareExplainerStep[] = [
  { id: "fill", image: `${WATERING_ART_DIR}/1.png`, caption: "Fill the Water Reservoir" },
  { id: "wick", image: `${WATERING_ART_DIR}/2.png`, caption: "Water reaches the soil as needed" },
  { id: "grow", image: `${WATERING_ART_DIR}/3.png`, caption: "Healthy and Happy Plant" },
];

const defaultAquariumSteps: CareExplainerStep[] = [
  { id: "setup", image: "/images/healthy-aquarium-step-1.jpg", caption: "Set Up the Aquarium" },
  { id: "fill-water", image: "/images/healthy-aquarium-step-2.jpg", caption: "Fill with Clean Water" },
  { id: "filter-balance", image: "/images/healthy-aquarium-step-3.jpg", caption: "Filter & Balance the Water" },
  { id: "add-fish", image: "/images/healthy-aquarium-step-4.jpg", caption: "Add Fish & Enjoy" },
];

function CareExplainerBand({
  title,
  description,
  image,
  imageAlt,
  stepsTitle = "How it works",
  steps,
}: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  stepsTitle?: string;
  steps: CareExplainerStep[];
}) {
  const visibleSteps = steps.slice(0, 4);
  const isFourSteps = visibleSteps.length >= 4;

  return (
    <section className="bg-[radial-gradient(120%_120%_at_20%_0%,#127a8c_0%,#0b5560_55%,#08424c_100%)] py-14 lg:py-20">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-10">
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl lg:max-w-none">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="text-white">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">{description}</p>

          <h3 className="mt-7 text-xl font-semibold sm:text-2xl">{stepsTitle}</h3>
          <ol
            className={
              isFourSteps
                ? "mt-9 grid max-w-[740px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-5"
                : "mt-9 grid max-w-[640px] grid-cols-3 gap-3 sm:gap-6"
            }
          >
            {visibleSteps.map((step, index) => (
              <li key={step.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-5 left-1/2 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-[#c8794f] text-sm font-semibold text-white shadow-lg sm:size-11 sm:text-base"
                >
                  {index + 1}
                </span>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <img
                    src={step.image}
                    alt={step.caption}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-medium leading-5 text-white sm:text-sm">{step.caption}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function SelfWateringSection({
  title = "About Self-Watering Planters",
  description = "Self-watering planters provide consistent moisture, prevent overwatering, and simplify care for healthy plant growth.",
  image = `${WATERING_ART_DIR}/care_plant.png`,
  stepsTitle = "How it works",
  steps = defaultSteps,
}: {
  title?: string;
  description?: string;
  image?: string;
  stepsTitle?: string;
  steps?: SelfWateringStep[];
}) {
  return (
    <CareExplainerBand
      title={title}
      description={description}
      image={image}
      imageAlt="Cutaway of a self-watering planter showing the water reservoir feeding the roots"
      stepsTitle={stepsTitle}
      steps={steps}
    />
  );
}

export function HealthyAquariumSection({
  title = "About a Healthy Aquarium",
  description = "Create a balanced aquatic environment where plants thrive, fish stay healthy, and water remains clean.",
  image = "/images/healthy-aquarium-main.jpg",
  stepsTitle = "How it works",
  steps = defaultAquariumSteps,
}: {
  title?: string;
  description?: string;
  image?: string;
  stepsTitle?: string;
  steps?: CareExplainerStep[];
}) {
  return (
    <CareExplainerBand
      title={title}
      description={description}
      image={image}
      imageAlt="Healthy planted freshwater aquarium with thriving aquatic plants and colourful fish"
      stepsTitle={stepsTitle}
      steps={steps}
    />
  );
}
