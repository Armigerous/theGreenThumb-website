import Content from "./Content";
import TableOfContents from "./TableOfContents";

const Tip = ({ tip }: { tip: TipType }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Table of Contents */}
      <div className="md:w-1/4 order-1 md:order-none">
        <TableOfContents tip={tip} />
      </div>

      {/* Blog Content */}
      <div className="md:w-3/4 order-2">
        <Content tip={tip} />
      </div>
    </div>
  );
};

export default Tip;
