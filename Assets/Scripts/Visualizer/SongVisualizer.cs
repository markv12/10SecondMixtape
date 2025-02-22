using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongVisualizer : MonoBehaviour {
    public RectTransform yourPartRect;
    public RectTransform otherPartRect;
    public RectTransform playheadRect;
    public NoteLine noteLinePrefab;
    public NoteSquare noteSquarePrefab;

    private List<NoteLine> yourPartNoteLines;
    private readonly List<NoteSquare> yourPartNoteSquares = new List<NoteSquare>();

    private List<NoteLine> otherPartNoteLines;
    private readonly List<NoteSquare> otherPartNoteSquares = new List<NoteSquare>();

    private float rectWidth;
    private float rectHeight;
    private Vector2 playheadStartPos; 
    private Vector2 playheadEndPos;
    private void Awake() {
        rectWidth = yourPartRect.rect.width;
        rectHeight = yourPartRect.rect.height;
        playheadStartPos = playheadRect.anchoredPosition.SetX(0);
        playheadEndPos = playheadRect.anchoredPosition.SetX(rectWidth);
    }

    private void AddNoteSquare(Note note, float songLength, Color color, NoteLine noteLine, List<NoteSquare> squareList, Action deleteAction) {
        NoteSquare newSquare = Instantiate(noteSquarePrefab, noteLine.rectT);

        double end = note.end == 0 ? note.start + SongRecorder.SMALLEST_NOTE_LENGTH : note.end;
        float startX = BeatToX(note.start, songLength, rectWidth);
        float width = BeatToX((end - note.start), songLength, rectWidth);
        newSquare.rectT.anchoredPosition = new Vector2(startX, 0);
        newSquare.rectT.sizeDelta = new Vector2(width, noteLine.rectT.rect.height);
        newSquare.mainImage.color = color;
        if (deleteAction != null) {
            newSquare.deleteAction = () => {
                squareList.Remove(newSquare);
                deleteAction?.Invoke();
            };
        } else {
            newSquare.mainButton.enabled = false;
        }
        squareList.Add(newSquare);
    }

    public void AddNoteSquare(Note note, int lineIndex, Color color, Action deleteAction) {
        AddNoteSquare(note, 10f, color, yourPartNoteLines[lineIndex], yourPartNoteSquares, deleteAction);
    }

    public void ShowInstrument(BandMember bandMember, double startWait, float songLength) {
        int lineCount = bandMember.NoteCount;
        yourPartNoteLines = new List<NoteLine>(new NoteLine[lineCount]);

        float lineHeight = rectHeight / lineCount;
        for (int i = 0; i < lineCount; i++) {
            NoteLine newLine = Instantiate(noteLinePrefab, yourPartRect);
            newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
            newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
            newLine.keyText.text = SongRecorder.KeyStringForLine(i);
            yourPartNoteLines[i] = newLine;
        }
        MovePlayhead(songLength, startWait);
    }

    public void ClearYourNoteSquares() {
        for (int i = 0; i < yourPartNoteSquares.Count; i++) {
            Destroy(yourPartNoteSquares[i].gameObject);
        }
        yourPartNoteSquares.Clear();
    }

    public void ClearLinesAndStop() {
        ClearNoteLines(yourPartNoteLines);
        ClearNoteLines(otherPartNoteLines);
        yourPartNoteSquares.Clear();
        otherPartNoteSquares.Clear();
        this.EnsureCoroutineStopped(ref playheadRoutine);
        playheadRect.anchoredPosition = playheadStartPos;
    }

    private static void ClearNoteLines(List<NoteLine> noteLines) {
        if (noteLines != null) {
            for (int i = 0; i < noteLines.Count; i++) {
                Destroy(noteLines[i].gameObject);
            }
            noteLines.Clear();
        }
    }

    private Coroutine playheadRoutine;
    private void MovePlayhead(float duration, double startWait) {
        playheadRoutine = StartCoroutine(MoveRoutine());

        IEnumerator MoveRoutine() {
            yield return new WaitForSeconds((float)startWait);
            playheadRect.SetAsLastSibling();

            float startTime = Time.time;
            while (true) {
                float timeSinceStart = Time.time - startTime;
                float progress = (timeSinceStart / duration) % 1;
                playheadRect.anchoredPosition = Vector2.Lerp(playheadStartPos, playheadEndPos, progress);
                yield return null;
            }
        }
    }

    private static float BeatToX(double beat, float songLength, float rectWidth) {
        return (float)((beat * SongPlayer.SECONDS_PER_BEAT * rectWidth) / songLength);
    }

    public void ShowOtherPart(InstrumentTrack track, float songLength) {
        BandMember bandMember = BandMemberMasterList.Instance.GetBandMemberForId(track.instrument);
        int lineCount = bandMember.NoteCount;
        otherPartNoteLines = new List<NoteLine>(new NoteLine[lineCount]);

        float lineHeight = rectHeight / Mathf.Max(lineCount, yourPartNoteLines.Count);
        for (int i = 0; i < lineCount; i++) {
            NoteLine newLine = Instantiate(noteLinePrefab, otherPartRect);
            newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
            newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
            newLine.keyText.text = null;
            newLine.lineImage.enabled = false;
            otherPartNoteLines[i] = newLine;

            List<Note> noteList = track.notes[i];
            for (int j = 0; j < noteList.Count; j++) {
                Note note = noteList[j];
                AddNoteSquare(note, songLength, bandMember.noteColor, newLine, otherPartNoteSquares, null);
            }
        }
    }
}
