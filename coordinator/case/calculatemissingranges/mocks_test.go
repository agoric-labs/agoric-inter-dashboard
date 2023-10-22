// Code generated by moq; DO NOT EDIT.
// github.com/matryer/moq

package calculatemissingranges

import (
	"context"
	"p2p-coordinator/model"
	"sync"
)

// Ensure, that EnvMock does implement Env.
// If this is not the case, regenerate this file with moq.
var _ Env = &EnvMock{}

// EnvMock is a mock implementation of Env.
//
//	func TestSomethingThatUsesEnv(t *testing.T) {
//
//		// make and configure a mocked Env
//		mockedEnv := &EnvMock{
//			GetTendermintRangeFunc: func(ctx context.Context) (*model.HeightRange, error) {
//				panic("mock out the GetTendermintRange method")
//			},
//		}
//
//		// use mockedEnv in code that requires Env
//		// and then make assertions.
//
//	}
type EnvMock struct {
	// GetTendermintRangeFunc mocks the GetTendermintRange method.
	GetTendermintRangeFunc func(ctx context.Context) (*model.HeightRange, error)

	// calls tracks calls to the methods.
	calls struct {
		// GetTendermintRange holds details about calls to the GetTendermintRange method.
		GetTendermintRange []struct {
			// Ctx is the ctx argument value.
			Ctx context.Context
		}
	}
	lockGetTendermintRange sync.RWMutex
}

// GetTendermintRange calls GetTendermintRangeFunc.
func (mock *EnvMock) GetTendermintRange(ctx context.Context) (*model.HeightRange, error) {
	if mock.GetTendermintRangeFunc == nil {
		panic("EnvMock.GetTendermintRangeFunc: method is nil but Env.GetTendermintRange was just called")
	}
	callInfo := struct {
		Ctx context.Context
	}{
		Ctx: ctx,
	}
	mock.lockGetTendermintRange.Lock()
	mock.calls.GetTendermintRange = append(mock.calls.GetTendermintRange, callInfo)
	mock.lockGetTendermintRange.Unlock()
	return mock.GetTendermintRangeFunc(ctx)
}

// GetTendermintRangeCalls gets all the calls that were made to GetTendermintRange.
// Check the length with:
//
//	len(mockedEnv.GetTendermintRangeCalls())
func (mock *EnvMock) GetTendermintRangeCalls() []struct {
	Ctx context.Context
} {
	var calls []struct {
		Ctx context.Context
	}
	mock.lockGetTendermintRange.RLock()
	calls = mock.calls.GetTendermintRange
	mock.lockGetTendermintRange.RUnlock()
	return calls
}
