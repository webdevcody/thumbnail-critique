import { formatDistance } from "date-fns";

export function timeFrom(datetime: number) {
  return formatDistance(new Date(datetime), new Date(), {
    addSuffix: true,
  });
}
