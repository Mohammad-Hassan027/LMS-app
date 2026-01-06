import { FilterIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { filterOptions } from "@/config";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilters, type FilterState } from "@/hooks/use-filters";

export default function CoursesSidebar() {
  const { filters, setFilters } = useFilters();
  function handleFilterOnChange(
    sectionId: keyof FilterState,
    option: { id: string; label: string }
  ) {
    setFilters((prev) => {
      const currentSection = prev[sectionId] || [];
      const index = currentSection.indexOf(option.id);

      let newSection;
      if (index === -1) {
        newSection = [...currentSection, option.id];
      } else {
        newSection = currentSection.filter((id) => id !== option.id);
      }

      return {
        [sectionId]: newSection.length > 0 ? newSection : null,
      };
    });
  }

  return (
    <Sidebar className="mt-16 h-[calc(100vh-4rem)] border-r bg-background">
      <SidebarHeader className="border-b px-4 flex justify-center font-bold">
        <span>Filters</span>
        <Button
          variant={"outline"}
          size="sm"
          onClick={() =>
            setFilters({ category: null, level: null, primaryLanguage: null })
          }
        >
          <FilterIcon /> Clear
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {Object.keys(filterOptions).map((keyItem) => {
          const sectionId = keyItem as keyof FilterState;
          return (
            <SidebarGroup key={`filter-group-${keyItem}`}>
              <SidebarGroupLabel className="text-base font-bold text-foreground">
                {keyItem
                  .split(/(?=[A-Z])/)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </SidebarGroupLabel>
              {filterOptions[keyItem as keyof typeof filterOptions].map(
                (option) => (
                  <SidebarGroupContent
                    className="pt-2"
                    key={`filter-${keyItem}-${option.id}`}
                  >
                    <div className="flex items-center space-x-2 px-2">
                      <Checkbox
                        id={`filter-${keyItem}-${option.id}-checkbox`}
                        checked={
                          filters[sectionId]?.includes(option.id) ?? false
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(sectionId, option)
                        }
                      />
                      <Label
                        htmlFor={`filter-${keyItem}-${option.id}-checkbox`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </Label>
                    </div>
                  </SidebarGroupContent>
                )
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter />
    </Sidebar>
  );
}
