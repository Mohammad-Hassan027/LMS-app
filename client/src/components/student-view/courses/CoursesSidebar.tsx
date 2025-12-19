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
} from "../../../components/ui/sidebar";
import { filterOptions } from "../../../config";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import type { ReactNode } from "react";

function RenderSidebarGroup() {
  const group: Array<ReactNode> = [];

  for (const key in filterOptions) {
    if (!Object.hasOwn(filterOptions, key)) continue;

    const element = filterOptions[key as keyof typeof filterOptions];
    group.push(
      <SidebarGroup key={`filter-group-${key}`}>
        <SidebarGroupLabel className="text-base font-bold text-foreground">
          {key
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </SidebarGroupLabel>
        {element.map((option) => (
          <SidebarGroupContent
            className="pt-2"
            key={`filter-${key}-${option.id}`}
          >
            <div className="flex items-center space-x-2 px-2">
              <Checkbox id={`filter-${key}-${option.id}-checkbox`} />
              <Label
                htmlFor={`filter-${key}-${option.id}-checkbox`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </Label>
            </div>
          </SidebarGroupContent>
        ))}
      </SidebarGroup>
    );
  }

  return group;
}

export default function CoursesSidebar() {
  return (
    <Sidebar className="mt-16 h-[calc(100vh-4rem)] border-r bg-background">
      <SidebarHeader className="border-b px-4 flex justify-center font-bold">
        <span>Filters</span>
        <Button variant={"outline"}>
          <FilterIcon /> Clear filter
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {RenderSidebarGroup().map((group) => group)}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter />
    </Sidebar>
  );
}
