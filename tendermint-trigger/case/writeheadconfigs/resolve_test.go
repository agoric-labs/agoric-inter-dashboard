package writeheadconfigs

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
		ctx context.Context
		env Env
	}
	tests := []struct {
		name        string
		args        args
		wantErr     bool
		wantConfigs []model.HeightRange
	}{
		{"without the blocks table", args{context.Background(), &EnvMock{
			GetLatestDBHeightFunc: func(ctx context.Context) (*int64, error) {
				return nil, nil
			},
			GetLatestStatusHeightFunc: func(context context.Context) (int64, error) {
				return 60, nil
			},
			WriteConfigFunc: func(rg model.HeightRange) error {
				return nil
			},
			WaitNextBlockFunc: func() error {
				return nil
			},
		}}, false, []model.HeightRange{
			{Earliest: 60, Latest: 60},
		}},
		{"3 batches and has more", args{context.Background(), &EnvMock{
			GetMaxWriteCountFunc: func() int {
				return 3
			},
			GetBatchSizeFunc: func() int64 {
				return 10
			},
			GetLatestDBHeightFunc: func(ctx context.Context) (*int64, error) {
				return int64p(29), nil
			},
			GetLatestStatusHeightFunc: func(context context.Context) (int64, error) {
				return 60, nil
			},
			WriteConfigFunc: func(rg model.HeightRange) error {
				return nil
			},
			WaitNextBlockFunc: func() error {
				return nil
			},
		}}, false, []model.HeightRange{
			{Earliest: 30, Latest: 39},
			{Earliest: 40, Latest: 49},
			{Earliest: 50, Latest: 59},
		}},
		{"just 3 batches", args{context.Background(), &EnvMock{
			GetMaxWriteCountFunc: func() int {
				return 3
			},
			GetBatchSizeFunc: func() int64 {
				return 10
			},
			GetLatestDBHeightFunc: func(ctx context.Context) (*int64, error) {
				return int64p(29), nil
			},
			GetLatestStatusHeightFunc: func(context context.Context) (int64, error) {
				return 58, nil
			},
			WriteConfigFunc: func(rg model.HeightRange) error {
				return nil
			},
			WaitNextBlockFunc: func() error {
				return nil
			},
		}}, false, []model.HeightRange{
			{Earliest: 30, Latest: 39},
			{Earliest: 40, Latest: 49},
			{Earliest: 50, Latest: 58},
		}},
		{"db has fresh blocks", args{context.Background(), &EnvMock{
			GetMaxWriteCountFunc: func() int {
				return 3
			},
			GetBatchSizeFunc: func() int64 {
				return 10
			},
			GetLatestDBHeightFunc: func(ctx context.Context) (*int64, error) {
				return int64p(29), nil
			},
			GetLatestStatusHeightFunc: func(context context.Context) (int64, error) {
				return 20, nil
			},
			WaitNextBlockFunc: func() error {
				return nil
			},
		}}, false, []model.HeightRange{}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := Resolve(tt.args.ctx, tt.args.env); (err != nil) != tt.wantErr {
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
