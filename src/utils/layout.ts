import type { CalendarEvent } from "@/types/kira";

interface EventPosition {
  left: string;
  width: string;
}

export const calculateEventLayout = (events: CalendarEvent[]): Map<string, EventPosition> => {
  const layoutMap = new Map<string, EventPosition>();

  // 1. Sort events by start time, then duration (longer first)
  const sortedEvents = [...events].sort((a, b) => {
    if (a.start.getTime() !== b.start.getTime()) {
      return a.start.getTime() - b.start.getTime();
    }
    return b.end.getTime() - b.start.getTime() - (a.end.getTime() - a.start.getTime());
  });

  // 2. Group overlapping events
  const columns: CalendarEvent[][] = [];

  sortedEvents.forEach(event => {
    // Find the first column where this event fits without overlapping
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const lastEventInColumn = column[column.length - 1];

      // Check if overlaps with the last event in this column
      // Actually, we need to check against ALL events in the column that might overlap
      // But since we sort by start time, we mainly care if the previous event ends after this one starts
      // Wait, a column is a vertical stack of non-overlapping events.

      // Simple overlap check: does this event start before the last event in this column ends?
      if (lastEventInColumn.end.getTime() <= event.start.getTime()) {
        column.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([event]);
    }
  });

  // This simple column packing isn't quite enough for "Google Calendar" style where they expand if space is available.
  // But for a first pass to avoid overlap, "packing" is good.
  // Let's try a slightly more robust approach:
  // 1. Detect "clusters" of overlapping events.
  // 2. For each cluster, assign width = 1/N.

  // Let's stick to the simple column approach first, but calculate width based on total columns at any given time.
  // Actually, the standard algorithm is:
  // 1. Compute "columns" for each event (visual column index).
  // 2. Compute "max columns" for the cluster.

  // Revised Algorithm:
  // 1. Expand events into "lanes".
  // Lane i contains events that don't overlap with each other in that lane.

  const lanes: CalendarEvent[][] = [];
  // Use a Map to track lane indices instead of mutating event objects
  const laneIndexMap = new Map<string, number>();

  sortedEvents.forEach(event => {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      // Check if event overlaps with ANY event in this lane
      const hasOverlap = lane.some(e => event.start < e.end && event.end > e.start);

      if (!hasOverlap) {
        lane.push(event);
        placed = true;
        // Store the lane index in our map
        laneIndexMap.set(event.id, i);
        break;
      }
    }

    if (!placed) {
      lanes.push([event]);
      laneIndexMap.set(event.id, lanes.length - 1);
    }
  });

  // Now we have lanes. But we want events to expand if possible.
  // For now, let's just do equal width for all lanes in a cluster.
  // A cluster is a group of events that are connected by overlaps.

  // Simple approach: Just use the total number of lanes as the divisor.
  // This might make some events narrow unnecessarily if they don't overlap with the "busy" part.
  // But it's a safe start.

  const totalLanes = lanes.length;
  if (totalLanes === 0) return layoutMap;

  // Wait, this calculates total lanes for the WHOLE DAY. That's bad if I have a busy morning and empty afternoon.
  // I need to group by "clusters".

  // Cluster detection
  const clusters: CalendarEvent[][] = [];
  let currentCluster: CalendarEvent[] = [];
  let clusterEnd = 0;

  sortedEvents.forEach(event => {
    if (currentCluster.length === 0) {
      currentCluster.push(event);
      clusterEnd = event.end.getTime();
    } else {
      if (event.start.getTime() < clusterEnd) {
        currentCluster.push(event);
        clusterEnd = Math.max(clusterEnd, event.end.getTime());
      } else {
        clusters.push(currentCluster);
        currentCluster = [event];
        clusterEnd = event.end.getTime();
      }
    }
  });
  if (currentCluster.length > 0) clusters.push(currentCluster);

  // Now process each cluster
  clusters.forEach(cluster => {
    const clusterLanes: CalendarEvent[][] = [];
    const clusterLaneIndexMap = new Map<string, number>();

    cluster.forEach(event => {
      let placed = false;
      for (let i = 0; i < clusterLanes.length; i++) {
        const lane = clusterLanes[i];
        const hasOverlap = lane.some(e => event.start < e.end && event.end > e.start);
        if (!hasOverlap) {
          lane.push(event);
          clusterLaneIndexMap.set(event.id, i);
          placed = true;
          break;
        }
      }
      if (!placed) {
        clusterLanes.push([event]);
        clusterLaneIndexMap.set(event.id, clusterLanes.length - 1);
      }
    });

    const width = 100 / clusterLanes.length;

    cluster.forEach(event => {
      const laneIndex = clusterLaneIndexMap.get(event.id) ?? 0;
      layoutMap.set(event.id, {
        left: `${laneIndex * width}%`,
        width: `${width}%`,
      });
    });
  });

  return layoutMap;
};
