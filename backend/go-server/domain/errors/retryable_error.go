package errors

import "fmt"

type RetryableError struct {
	cause error
}

// nolint:errcheck
var _ error = (*RetryableError)(nil)

func NewRetryableError(cause error) *RetryableError {
	return &RetryableError{cause: cause}
}

func (re *RetryableError) Error() string {
	return fmt.Sprintf("retryable: %s", re.cause.Error())
}

func (re *RetryableError) Unwrap() error {
	return re.cause
}
