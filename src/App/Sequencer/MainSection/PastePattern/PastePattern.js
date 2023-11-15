import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as icons from 'assets/icons/kit';
import { paste } from 'App/reducers/sequenceSlice';
import { Button } from 'App/shared/Button';
import { Portal } from 'App/shared/Portal';
import { getGrid } from 'utils/getGrid';
import { useAddAndRemoveClass } from 'hooks/useShowAndHide';

export const PastePattern = () => {
  const kit = useSelector((state) => state.sequence.present.kit);
  const samples = useSelector((state) => state.assets.kits[kit].samples);

  const grid = useMemo(() => getGrid(samples.length), [samples.length]);
  const pastePatternMemo = useMemo(() => {
    return (
      <Portal targetId='overGridPortal'>
        <div id='pastePattern' className={'pastePattern'}>
          <div className='samples'>
            {grid.map((i) => {
              return (
                <SampleBtn
                  key={`pastePattern-${samples[i].name}`}
                  i={i}
                  icon={samples[i].icon}
                  color={samples[i].color}
                />
              );
            })}
          </div>
        </div>
      </Portal>
    );
  }, [grid, samples]);
  return pastePatternMemo;
};

const SampleBtn = ({ i, icon, color }) => {
  const dispatch = useDispatch();
  const selectedSample = useSelector((state) => state.editor.selectedSample);
  const pattern = useSelector((state) => state.sequence.present.pattern);

  const [flashClass, triggerFlash] = useAddAndRemoveClass('cells', 'selected', 2000);
  const onClick = useCallback(() => {
    dispatch(paste({ sample: i, selectedSample }));
    triggerFlash();
  }, [dispatch, i, selectedSample, triggerFlash]);

  const selected = i === selectedSample;
  const classes = selected ? 'sample flashing borderActive' : 'sample borderDefault';

  const memo = useMemo(() => {
    return (
      <Button classes={classes} disabled={selected} onClick={onClick}>
        {selected ? (
          <p className='flashing'>copying...</p>
        ) : (
          <div className='icon-wrapper'>{icons[icon](color)}</div>
        )}
        <div className={flashClass}>
          {pattern.map((step, s) => {
            const classes = step[i].noteOn ? `cell bg${i} on` : 'cell';
            return <div key={`pastePattern-${s}-${i}`} className={classes} />;
          })}
        </div>
      </Button>
    );
  }, [classes, color, flashClass, i, icon, onClick, pattern, selected]);
  return memo;
};
