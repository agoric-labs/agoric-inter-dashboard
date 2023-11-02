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

func TestBatchHeightRanges(t *testing.T) {
	type args struct {
		ranges    []*HeightRange
		batchSize int64
	}
	tests := []struct {
		name string
		args args
		want [][]*HeightRange
	}{
		{"zero", args{batchSize: 10}, nil},
		{"one", args{batchSize: 10, ranges: []*HeightRange{
			{Earliest: 1, Latest: 20},
		}}, [][]*HeightRange{
			{{Earliest: 1, Latest: 20}},
		}},
		{"two", args{batchSize: 10, ranges: []*HeightRange{
			{Earliest: 1, Latest: 20},
			{Earliest: 21, Latest: 25},
			{Earliest: 26, Latest: 30},
		}}, [][]*HeightRange{
			{{Earliest: 1, Latest: 20}},
			{{Earliest: 21, Latest: 25}, {Earliest: 26, Latest: 30}},
		}},
		{"four", args{batchSize: 12, ranges: []*HeightRange{
			{Earliest: 1, Latest: 20},
			{Earliest: 21, Latest: 25},
			{Earliest: 26, Latest: 30},
			{Earliest: 31, Latest: 32},
		}}, [][]*HeightRange{
			{{Earliest: 1, Latest: 20}},
			{{Earliest: 21, Latest: 25}, {Earliest: 26, Latest: 30}, {Earliest: 31, Latest: 32}},
		}},
		{"2x2", args{batchSize: 10, ranges: []*HeightRange{
			{Earliest: 1, Latest: 5},
			{Earliest: 6, Latest: 10},
			{Earliest: 26, Latest: 30},
			{Earliest: 31, Latest: 32},
		}}, [][]*HeightRange{
			{{Earliest: 1, Latest: 5}, {Earliest: 6, Latest: 10}},
			{{Earliest: 26, Latest: 30}, {Earliest: 31, Latest: 32}},
		}},
		{"big numbers", args{batchSize: 250, ranges: []*HeightRange{
			{Earliest: 17535112, Latest: 17535211},
			{Earliest: 17534812, Latest: 17534911},
		}}, [][]*HeightRange{
			{{Earliest: 17535112, Latest: 17535211}, {Earliest: 17534812, Latest: 17534911}},
		}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := BatchHeightRanges(tt.args.ranges, tt.args.batchSize); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("BatchHeightRanges() = %v, want %v", got, tt.want)
			}
		})
	}
}
