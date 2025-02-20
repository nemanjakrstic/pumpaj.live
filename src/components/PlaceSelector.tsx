import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Select from "react-select";
import { autocomplete, getPlace } from "../api";
import { useStore } from "../store";

export const PlaceSelector = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInput] = useDebouncedValue(inputValue, 500);
  const place = useStore((state) => state.place);
  const value = { value: place.id, label: place.title };

  const { data, isLoading } = useQuery({
    queryKey: ["geocode", debouncedInput],
    queryFn: async () => {
      if (debouncedInput.length < 3) {
        return { ResultItems: [], dummy: true };
      }

      return autocomplete({
        QueryText: debouncedInput,
        Filter: { IncludeCountries: ["SRB"] },
      });
    },
  });

  const options = data?.ResultItems.map((item) => ({
    value: item.PlaceId,
    label: item.Title,
  }));

  return (
    <Select
      inputValue={inputValue}
      onInputChange={setInputValue}
      isLoading={isLoading || debouncedInput !== inputValue}
      options={options}
      value={value}
      placeholder="Pretraga"
      noOptionsMessage={() =>
        data && "dummy" in data
          ? "Ukucaj 3 ili više slova za pretragu"
          : "Mesto nije pronađeno"
      }
      onChange={(option) => {
        if (!option) {
          return;
        }

        useStore.setState({
          place: { id: option.value, title: option.label },
        });

        getPlace(option.value).then((result) => {
          const [lng, lat] = result.Position;
          useStore.setState({ location: { lng, lat } });
        });
      }}
    />
  );
};
