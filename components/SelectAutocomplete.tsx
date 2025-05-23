"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Listbox,
  ListboxItem,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

type ChangeHandler = (selectedKeys: string[]) => void;

const removeAccents = (str: string) => {
  return str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const SearchableSelect = ({
  options,
  multiple = false,
  disabled = false,
  placeholder = "Select or search...",
  label = "Select an option",
  value,
  onChange,
  required = false,
  labelSeleccionado = true,
  variant = "flat",
  ...props
}: {
  options: any[];
  multiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  value: string | string[] | null;
  onChange: ChangeHandler;
  required?: boolean;
  labelSeleccionado?: boolean;
  variant?: "flat" | "faded" | "bordered" | "underlined";
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedValues, setSelectedValues] = useState(
    multiple ? new Set(value || []) : [value],
  );

  useEffect(() => {
    if (value) {
      onChange(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  useEffect(() => {
    setSelectedValues(multiple ? new Set(value || []) : [value]);
  }, [value, multiple]);

  const handleSelectionChange = (selectedKeys: string[]) => {
    const newSelection = multiple
      ? new Set(selectedKeys)
      : [selectedKeys[0] || null];

    // Verificar si newSelection es diferente de selectedValues
    const isDifferent = multiple
      ? Array.from(newSelection).sort().toString() !==
        Array.from(selectedValues).sort().toString()
      : newSelection[0] !== selectedValues[0];

    if (isDifferent) {
      setSelectedValues(newSelection);
      onChange &&
        onChange(
          Array.from(newSelection).filter(
            (item): item is string => item !== null,
          ),
        );
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const listboxRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options?.filter((option) =>
    removeAccents(option.label)
      ?.toLowerCase()
      ?.includes(removeAccents(searchTerm.toLowerCase())),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listboxRef.current &&
        !listboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    if (isOpen && inputRef.current && dropdownRef.current) {
      const rect = inputRef.current.getBoundingClientRect();

      setDropdownStyle({
        position: "fixed",
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 100000,
        borderRadius: "1rem",
      });
    }
  }, [isOpen]);

  return (
    <div ref={listboxRef} className="relative w-full flex flex-col gap-2">
      {multiple ? (
        <div className="relative w-full">
          <div
            ref={inputRef}
            className="input-wrapper w-full flex flex-col gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Input
              aria-label={label}
              className="input-classname"
              color="primary"
              endContent={
                isOpen ? (
                  <Icon
                    className="pointer-events-none text-md "
                    icon="solar:alt-arrow-up-line-duotone"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-md "
                    icon="solar:alt-arrow-down-line-duotone"
                  />
                )
              }
              isDisabled={disabled}
              isRequired={required}
              label={label}
              placeholder={placeholder}
              size="sm"
              value={searchTerm}
              variant={variant}
              onChange={handleSearchChange}
            />

            {labelSeleccionado && (
              <p className="ml-2 text-default-500 text-[0.7rem]">
                {" "}
                Seleccionado:
                {Array.from(selectedValues)
                  .map((value) => {
                    const option = options.find((opt) => opt.value === value);

                    return option ? option.label : null;
                  })
                  .filter((label) => label !== null)
                  .join(", ")}
              </p>
            )}
          </div>
          {isOpen && (
            <div
              ref={dropdownRef}
              className="bg-white shadow-lg rounded-md max-h-64 overflow-auto"
              style={dropdownStyle}
            >
              <Listbox
                aria-label={label}
                className="w-full"
                color="primary"
                disallowEmptySelection={!multiple}
                isDisabled={disabled}
                isRequired={required}
                selectedKeys={
                  multiple ? Array.from(selectedValues) : selectedValues
                }
                selectionMode={multiple ? "multiple" : "single"}
                variant="flat"
                onSelectionChange={handleSelectionChange}
              >
                {filteredOptions.map((option) => (
                  <ListboxItem key={option.value} value={option.value}>
                    {option.label}
                  </ListboxItem>
                ))}
              </Listbox>
            </div>
          )}
        </div>
      ) : (
        <Autocomplete
          className=""
          color="primary"
          isDisabled={disabled}
          isRequired={required}
          label={label}
          placeholder={placeholder}
          selectedKey={selectedValues[0]} // Use single value from array
          variant={variant}
          onSelectionChange={(key) => handleSelectionChange([key])} // Convert single key to array
          {...props}
        >
          {options.map((option) => (
            <AutocompleteItem key={option.value} value={option.value}>
              {option.label}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    </div>
  );
};

export default SearchableSelect;
