import { MODES, setTapCellById, setToggleOn } from 'App/reducers/editorSlice';
import { modCell } from 'App/reducers/sequenceSlice';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useCell = (id, step, prevCellRef) => {
  const dispatch = useDispatch();

  const selectedSample = useSelector((state) => state.editor.selectedSample);
  const moddingPitch = useSelector((state) => state.editor.mode === MODES.MOD_PITCH);
  const editing = selectedSample !== -1;

  const noteOn = useSelector((state) =>
    editing ? state.sequence.present.pattern[step][selectedSample].noteOn : false
  );
  const slice = useSelector((state) =>
    editing ? state.sequence.present.pattern[step][selectedSample].notes.length : 1
  );
  const pitch = useSelector((state) =>
    editing ? state.sequence.present.pattern[step][selectedSample].notes[0].pitch : 24
  );
  const length = useSelector((state) =>
    editing ? state.sequence.present.pattern[step][selectedSample].notes[0].length : 1
  );
  const velocity = useSelector((state) =>
    editing ? state.sequence.present.pattern[step][selectedSample].notes[0].velocity : 1
  );

  const tapCell = useCallback(() => {
    dispatch(modCell(step, noteOn));
  }, [dispatch, noteOn, step]);

  // dragging: tap flag sent from Grid onTouchMove/onMouseMove
  const tapThisCell = useSelector((state) => state.editor.tapCellById[id]);
  useEffect(() => {
    if (!tapThisCell) return;
    tapCell();
    dispatch(setTapCellById({ id, val: false }));
  }, [dispatch, id, tapCell, tapThisCell]);

  const startFunc = useCallback(
    (e) => {
      dispatch(setToggleOn(!noteOn)); // set dragging effect
      prevCellRef.current = id; // for Grid onTouchMove
      tapCell();
    },
    [dispatch, id, noteOn, prevCellRef, tapCell]
  );

  const state = useMemo(() => {
    const classes = {};
    const styles = {};
    const values = {};

    values.midiNote = noteOn && moddingPitch ? pitch : null;

    classes.cell = noteOn ? 'cell on' : 'cell';
    classes.bg = noteOn ? `bg bg${selectedSample}` : 'bg';
    classes.slice1 = moddingPitch
      ? 'slice'
      : noteOn && slice === 2
      ? 'slice slice-2'
      : noteOn && slice === 3
      ? 'slice slice-3'
      : 'slice';
    classes.slice2 = moddingPitch ? 'slice' : noteOn && slice > 2 ? 'slice slice-2' : 'slice';

    styles.bg = {
      transform: length >= 1 ? 'scaleX(1)' : `scaleX(${length * 3})`,
    };
    if (noteOn) styles.bg.opacity = velocity;

    return { classes, styles, values };
  }, [length, moddingPitch, noteOn, pitch, selectedSample, slice, velocity]);

  return { state, startFunc };
};
