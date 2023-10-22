package main

import (
	"fmt"
	"io"
	"net/http"
	"p2p-coordinator/model"
	"sort"
	"text/template"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func runServer(addr string) {
	http.Handle("/metrics", promhttp.Handler())

	http.HandleFunc("/", func(writer http.ResponseWriter, req *http.Request) {
		writer.Header().Set("Content-Type", "text/html")

		err := writeMonitoringPage(writer)
		if err != nil {
			http.Error(writer, "internal error, check logs", http.StatusInternalServerError)
			log.Error().Err(err).Msg("failed to writeMonitoringPage")
		}
	})

	server := &http.Server{
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}

	log.Info().Str("addr", addr).Msg("serve metrics")

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to ListenAndServe")
	}
}

const monitoringTemplateStr = `
  <!doctype html>
	<meta http-equiv="refresh" content="5" />
	<title>Monitoring</title>

	<style type="text/css">
	  html, body {
			font-family: Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,
				Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,
				Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
			font-size: 16px;
		}

		.block {
			padding: 4px;
			width: 300px;
		}
	</style>

	{{ range .Ranges }}
		{{ if gt .Hole 0 }}
			<div class="block" style="background: red; color: white">
			  Hole: {{ .Hole }}
			</div>
		{{ end }}
		<div style="background: {{ if .Synced }}green{{ else }}blue; color: white{{end}}" class="block">
			{{ .Value.Earliest }} - {{ .Value.Latest }} ({{ .Count }})
		</div>
	{{ end }}

	{{ if gt .MoreCount 0 }}
		<div>
		  And {{ .MoreCount }} ranges...
		</div>
	{{ end }}
`

var monitoringTemplate = template.Must(template.New("status").Parse(monitoringTemplateStr))

func writeMonitoringPage(writer io.Writer) error {
	state.Lock()
	defer state.Unlock()

	type Range struct {
		Value  *model.HeightRange
		Count  int64
		Hole   int64
		Synced bool
	}

	var data struct {
		Ranges    []*Range
		MoreCount int
	}

	for _, n := range state.SyncedRanges {
		data.Ranges = append(data.Ranges, &Range{Value: n, Synced: true, Count: n.Size()})
	}

	for _, n := range state.NewRanges {
		data.Ranges = append(data.Ranges, &Range{Value: n, Synced: false, Count: n.Size()})
	}

	sort.Slice(data.Ranges, func(i, j int) bool {
		return data.Ranges[i].Value.Earliest > data.Ranges[j].Value.Earliest
	})

	const maxRangeCount = 32

	rangeCount := len(data.Ranges)
	if rangeCount > maxRangeCount {
		data.MoreCount = rangeCount - maxRangeCount
		data.Ranges = data.Ranges[0:maxRangeCount]
	}

	for idx := 1; idx < len(data.Ranges); idx++ {
		// 5 10 [i-1]
		// 1 3 [i]
		holeLatest := data.Ranges[idx-1].Value.Earliest
		holeEarliest := data.Ranges[idx].Value.Latest + 1

		if holeLatest != holeEarliest {
			data.Ranges[idx].Hole = holeLatest - holeEarliest
		}
	}

	err := monitoringTemplate.Execute(writer, &data)
	if err != nil {
		return fmt.Errorf("failed to write html: %w", err)
	}

	return nil
}
