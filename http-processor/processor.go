package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os/exec"
	"strings"
	"syscall"
)

type processor struct {
	cmd   []string
	token string
}

var knownParseErr = `Error: errUnknownField "*types.Any": {TagNum: 15, WireType:"start_group"}: tx parse error`

func (p *processor) run(writer http.ResponseWriter, req *http.Request) error {
	if req.Method != http.MethodPost || req.Header.Get("X-Token") != p.token {
		http.NotFound(writer, req)

		return nil
	}

	defer req.Body.Close()

	var buf bytes.Buffer

	data, err := io.ReadAll(req.Body)
	if err != nil {
		return fmt.Errorf("failed to read body: %w", err)
	}

	cmd := exec.CommandContext(req.Context(), p.cmd[0], p.cmd[1:]...) //nolint:gosec
	cmd.Stdin = bytes.NewBuffer(data)
	cmd.Stdout = writer
	// Stderr uses as a log destination
	cmd.Stderr = &buf
	// request the OS to assign process group to the new process,
	// to which all its children will belong
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	err = cmd.Run()
	errText := buf.String()

	if err != nil {
		log.Info().Str("data", string(data)).Str("err", errText).Msg("failed data")

		if strings.Contains(errText, knownParseErr) {
			log.Warn().Str("stderr", errText).Msg("failed to parse")

			var resp struct {
				Error string `json:"error"`
			}

			err := json.NewEncoder(writer).Encode(resp)
			if err != nil {
				return fmt.Errorf("failed to marshal an error resp: %w", err)
			}

			return nil
		}

		return fmt.Errorf("failed to run: %w %+v", err, p.cmd)
	}

	if len(errText) > 0 {
		log.Warn().Err(err).Str("out", errText).Msg("stderr")
	}

	return nil
}
