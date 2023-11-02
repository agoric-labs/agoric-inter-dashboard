package calculatemissingranges

import (
	"context"
	"p2p-coordinator/model"
	"reflect"
	"testing"

	"github.com/kr/pretty"
)

//go:generate moq -out mocks_test.go . Env

func TestResolve(t *testing.T) {
	ctx := context.Background()

	type args struct {
		ctx   context.Context
		env   Env
		input Input
	}
	tests := []struct {
		name    string
		args    args
		want    []*model.HeightRange
		wantErr bool
	}{
		{"a first run without limits", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 11}, nil
			},
		}, Input{BatchSize: 5, OutputLimit: 10}}, []*model.HeightRange{
			{Earliest: 7, Latest: 11},
			{Earliest: 2, Latest: 6},
			{Earliest: 1, Latest: 1},
		}, false},
		{"a first run with limits", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 11}, nil
			},
		}, Input{BatchSize: 5, OutputLimit: 2}}, []*model.HeightRange{
			{Earliest: 7, Latest: 11},
			{Earliest: 2, Latest: 6},
		}, false},
		{"a second run with limits (tail)", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 11}, nil
			},
		}, Input{
			BatchSize:   5,
			OutputLimit: 2,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 7, Latest: 11},
				{Earliest: 2, Latest: 6},
			},
		}}, []*model.HeightRange{
			{Earliest: 1, Latest: 1},
		}, false},
		{"a second run with limits (tail+middle)", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 11}, nil
			},
		}, Input{
			BatchSize:   5,
			OutputLimit: 2,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 7, Latest: 11},
				{Earliest: 2, Latest: 5},
			},
		}}, []*model.HeightRange{
			{Earliest: 6, Latest: 6},
			{Earliest: 1, Latest: 1},
		}, false},
		{"a second run with limits (head+middle+tail)", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 12}, nil
			},
		}, Input{
			BatchSize:   5,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 7, Latest: 11},
				{Earliest: 2, Latest: 5},
			},
		}}, []*model.HeightRange{
			{Earliest: 12, Latest: 12},
			{Earliest: 6, Latest: 6},
			{Earliest: 1, Latest: 1},
		}, false},
		{"with a new truncated node", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 5, Latest: 6}, nil
			},
		}, Input{
			BatchSize:   5,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 1, Latest: 11},
			},
		}}, []*model.HeightRange{}, false},
		{"only head heights", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 20}, nil
			},
		}, Input{
			BatchSize:   10,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 1, Latest: 10},
			},
		}}, []*model.HeightRange{
			{Earliest: 11, Latest: 20},
		}, false},
		{"detect collisions", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 1, Latest: 20}, nil
			},
		}, Input{
			BatchSize:   10,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 1, Latest: 10},
				{Earliest: 10, Latest: 20},
			},
		}}, nil, true},
		{"nothing to download (splitbrain)", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 10, Latest: 30}, nil
			},
		}, Input{
			BatchSize:   10,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 1, Latest: 5},
			},
		}}, nil, true},
		{"nothing to download 2 (splitbrain)", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 10, Latest: 30}, nil
			},
		}, Input{
			BatchSize:   10,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 40, Latest: 50},
			},
		}}, nil, true},
		{"partial splitbrain", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 10, Latest: 30}, nil
			},
		}, Input{
			BatchSize:   10,
			OutputLimit: 3,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 15, Latest: 20},
				{Earliest: 21, Latest: 50},
			},
		}}, []*model.HeightRange{
			{Earliest: 10, Latest: 14},
		}, false},
		{"append holes from head to tail", args{ctx, &EnvMock{
			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
				return &model.HeightRange{Earliest: 16646001, Latest: 17531751}, nil
			},
		}, Input{
			BatchSize:   100,
			OutputLimit: 10,
			SyncedRanges: []*model.HeightRange{
				{Earliest: 17506189, Latest: 17531751},
			},
		}}, []*model.HeightRange{
			{Earliest: 17506089, Latest: 17506188},
			{Earliest: 17505989, Latest: 17506088},
			{Earliest: 17505889, Latest: 17505988},
			{Earliest: 17505789, Latest: 17505888},
			{Earliest: 17505689, Latest: 17505788},
			{Earliest: 17505589, Latest: 17505688},
			{Earliest: 17505489, Latest: 17505588},
			{Earliest: 17505389, Latest: 17505488},
			{Earliest: 17505289, Latest: 17505388},
			{Earliest: 17505189, Latest: 17505288},
		}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Resolve(tt.args.ctx, tt.args.env, tt.args.input)
			if (err != nil) != tt.wantErr {
				t.Errorf("Resolve() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolve() = %v, want %v", got, tt.want)

				for _, desc := range pretty.Diff(got, tt.want) {
					t.Error(desc)
				}
			}
		})
	}
}
