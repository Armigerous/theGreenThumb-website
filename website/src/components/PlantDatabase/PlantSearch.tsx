import Form from "next/form";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Input } from "../ui/input";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form action="/plants" scroll={false} className="w-full">
      <Input
        name="query"
        defaultValue={query}
        className=""
        placeholder="Search Plants..."
      />
      <div className="flex gap-2">
        <Button type="submit" className="">
          <Search />
        </Button>
        <Button type="button" className="">
          <Filter />
        </Button>
      </div>
    </Form>
  );
};

export default SearchForm;
