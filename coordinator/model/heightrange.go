package model

import (
	"sort"
)

// HeightRange describes a [from, to] range like [5; 6] or [5; 5].
type HeightRange struct {
	Earliest int64 `json:"earliest"`
	Latest   int64 `json:"latest"`
}

// Size returns count of blocks.
func (rg HeightRange) Size() int64 {
	return rg.Latest - rg.Earliest + 1
}

// CompressHeightRanges convert ranges like ([5; 6], [7; 8]) to [5; 8]).
func CompressHeightRanges(ranges []*HeightRange) []*HeightRange {
	if len(ranges) == 0 {
		return ranges
	}

	sort.Slice(ranges, func(i, j int) bool {
		return ranges[i].Earliest < ranges[j].Earliest
	})

	res := make([]*HeightRange, 0)
	rangeCount := len(ranges)
	nextRg := *ranges[0]

	for idx := 1; idx < rangeCount; idx++ {
		if nextRg.Latest+1 > ranges[idx].Earliest {
			panic("ranges overlaped!")
		}

		if nextRg.Latest+1 == ranges[idx].Earliest {
			nextRg.Latest = ranges[idx].Latest
		} else {
			v := nextRg // copy!
			res = append(res, &v)
			nextRg = *ranges[idx]
		}
	}

	// push a last range
	return append(res, &nextRg)
}
