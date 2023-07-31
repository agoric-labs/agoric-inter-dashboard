package writetailconfigs

import (
	"context"
	"p2p-tendermint-trigger/model"
	"testing"

	"github.com/kr/pretty"
)

//go:generate moq -out mocks_test.go . Env

func int64p(v int64) *int64 {
	return &v
}

func TestResolve(t *testing.T) {
	type args struct {
		env Env
	}
	tests := []struct {
		name        string
		args        args
		wantErr     bool
		wantConfigs []model.HeightRange
	}{
		{"2 records without stops", args{
			&EnvMock{
				GetMaxWriteCountFunc: func() int {
					return 2
				},
				GetBatchSizeFunc: func() int64 {
					return 3
				},
				GetEarliestStatusHeightFunc: func(ctx context.Context) (int64, error) {
					return 1, nil
				},
				GetEarliestDBHeightFunc: func(ctx context.Context) (*int64, error) {
					return int64p(10), nil
				},
				WriteConfigFunc: func(rg model.HeightRange) error {
					return nil
				},
			},
		}, false, []model.HeightRange{
			{Earliest: 7, Latest: 9},
			{Earliest: 4, Latest: 6},
		}},
		{"2 records with the stop", args{
			&EnvMock{
				GetMaxWriteCountFunc: func() int {
					return 3
				},
				GetBatchSizeFunc: func() int64 {
					return 3
				},
				GetEarliestStatusHeightFunc: func(ctx context.Context) (int64, error) {
					return 1, nil
				},
				GetEarliestDBHeightFunc: func(ctx context.Context) (*int64, error) {
					return int64p(5), nil
				},
				WriteConfigFunc: func(rg model.HeightRange) error {
					return nil
				},
			},
		}, false, []model.HeightRange{
			{Earliest: 2, Latest: 4},
			{Earliest: 1, Latest: 1},
		}},
		{"db contains old records", args{
			&EnvMock{
				GetMaxWriteCountFunc: func() int {
					return 3
				},
				GetBatchSizeFunc: func() int64 {
					return 3
				},
				GetEarliestStatusHeightFunc: func(ctx context.Context) (int64, error) {
					return 1, nil
				},
				GetEarliestDBHeightFunc: func(ctx context.Context) (int64, error) {
					return 0, nil
				},
				WriteConfigFunc: func(rg model.HeightRange) error {
					return nil
				},
			},
		}, false, []model.HeightRange{}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx := context.Background()

			if err := Resolve(ctx, tt.args.env); (err != nil) != tt.wantErr {
				t.Errorf("Resolve() error = %v, wantErr %v", err, tt.wantErr)
			}

			callConfigs := []model.HeightRange{}

			for _, call := range tt.args.env.(*EnvMock).WriteConfigCalls() {
				callConfigs = append(callConfigs, call.Rg)
			}

			for _, desc := range pretty.Diff(callConfigs, tt.wantConfigs) {
				t.Error(desc)
			}
		})
	}
}
