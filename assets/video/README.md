# Hero background video

**Current files:** `hero.mp4` and `hero.webm` are a 15-second loop built from the organization's two real photographs (slow push-in on the helicopter, crossfade, slow pan across the rescue boat, fade to navy at both ends so it loops cleanly). No AI-generated or stock footage was used. Replace them with real footage whenever the organization has some; keep the same file names and nothing else needs to change.

The render was made with ffmpeg from `research/fb-raw/helicopter-1008.jpg` and `research/fb-raw/rescue-boat-crew-820x360.jpg`.

To swap in real footage, drop it here with the same names. Until a file exists, the hero shows the helicopter photograph.

Files the page looks for, in this order:

| File | Format | Notes |
| --- | --- | --- |
| `hero.webm` | VP9 or AV1 | Optional, smaller. Served to browsers that support it. |
| `hero.mp4` | H.264, AAC or no audio | Required for Safari and older browsers. |

Recommended specs:

- 10 to 20 seconds, edited to loop cleanly
- 1920 x 1080, 24 or 30 fps
- No audio track needed; the page mutes it anyway
- Target 4 to 8 MB. A simple ffmpeg command:

```bash
ffmpeg -i source.mov -t 15 -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart hero.mp4
```

Behaviour built into the page:

- Muted, autoplaying, looping, no controls, behind a navy overlay
- Not loaded on screens narrower than 768 px, when the visitor has "reduce motion" set, or when the browser reports a data-saver connection; the photograph is shown instead
- A Pause / Play button appears in the corner once the video is playing
- If the files are missing or fail to load, the photograph stays and nothing else changes
