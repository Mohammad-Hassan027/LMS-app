import { FilterX } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { filterOptions } from "@/config";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilters, type FilterState } from "@/hooks/use-filters";
import { Badge } from "@/components/ui/badge";

export default function CoursesSidebar() {
  const { filters, setFilters } = useFilters();

  // Calculate total active filters for a badge (optional UX improvement)
  const totalActiveFilters = Object.values(filters)
    .flat()
    .filter(Boolean).length;

  function handleFilterOnChange(
    sectionId: keyof FilterState,
    option: { id: string; label: string },
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
    <Sidebar className="mt-16 h-[calc(100vh-4rem)] border-r bg-card/50">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg tracking-tight">Filters</h2>
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="px-2 py-0.5 text-xs">
              {totalActiveFilters} Active
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mt-2"
          onClick={() =>
            setFilters({ category: null, level: null, primaryLanguage: null })
          }
          disabled={totalActiveFilters === 0}
        >
          <FilterX className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {Object.keys(filterOptions).map((keyItem, idx) => {
          const sectionId = keyItem as keyof FilterState;
          return (
            <div key={`filter-group-${keyItem}`}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                  {keyItem.replace(/([A-Z])/g, " $1").trim()}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-3">
                    {filterOptions[keyItem as keyof typeof filterOptions].map(
                      (option) => (
                        <div
                          key={`filter-${keyItem}-${option.id}`}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`filter-${keyItem}-${option.id}`}
                            checked={
                              filters[sectionId]?.includes(option.id) ?? false
                            }
                            onCheckedChange={() =>
                              handleFilterOnChange(sectionId, option)
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`filter-${keyItem}-${option.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
              {idx < Object.keys(filterOptions).length - 1 && (
                <SidebarSeparator className="my-2 opacity-50" />
              )}
            </div>
          );
        })}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter />
    </Sidebar>
  );
}
