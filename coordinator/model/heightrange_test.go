package model

import (
	"reflect"
	"testing"

	"github.com/kr/pretty"
)

func TestCompressHeightRanges(t *testing.T) {
	type args struct {
		ranges []*HeightRange
	}
	tests := []struct {
		name string
		args args
		want []*HeightRange
	}{
		{"empty list", args{[]*HeightRange{}}, []*HeightRange{}},
		{"compress two ranges", args{[]*HeightRange{
			{Earliest: 1, Latest: 5},
			{Earliest: 6, Latest: 10},
		}}, []*HeightRange{
			{Earliest: 1, Latest: 10},
		}},
		{"compress three ranges", args{[]*HeightRange{
			{Earliest: 1, Latest: 5},
			{Earliest: 6, Latest: 10},
			{Earliest: 11, Latest: 20},
			{Earliest: 22, Latest: 30},
			{Earliest: 31, Latest: 40},
		}}, []*HeightRange{
			{Earliest: 1, Latest: 20},
			{Earliest: 22, Latest: 40},
		}},
		{"skip ranges with holes", args{[]*HeightRange{
			{Earliest: 1, Latest: 5},
			{Earliest: 7, Latest: 10},
		}}, []*HeightRange{
			{Earliest: 1, Latest: 5},
			{Earliest: 7, Latest: 10},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CompressHeightRanges(tt.args.ranges); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CompressHeightRanges() = %v, want %v", got, tt.want)

				for _, desc := range pretty.Diff(got, tt.want) {
					t.Error(desc)
				}
			}
		})
	}
}
