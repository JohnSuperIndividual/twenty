import { requiredQueryListenersState } from '@/sse-db-event/states/requiredQueryListenersState';
import { getSnapshotValue } from '@/ui/utilities/state/utils/getSnapshotValue';
import { useEffect } from 'react';
import { useRecoilCallback } from 'recoil';
import { type RecordGqlOperationSignature } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const useListenToObjectRecordEventsForQuery = ({
  queryId,
  operationSignature,
  skip,
}: {
  queryId: string;
  operationSignature: RecordGqlOperationSignature;
  skip?: boolean;
}) => {
  const changeQueryIdListenState = useRecoilCallback(
    ({ set, snapshot }) =>
      (shouldListen: boolean, queryId: string) => {
        const currentRequiredQueryListeners = getSnapshotValue(
          snapshot,
          requiredQueryListenersState,
        );

        const listeningForThisQueryIsActive =
          currentRequiredQueryListeners.some(
            (listener) => listener.queryId === queryId,
          );

        if (shouldListen === listeningForThisQueryIsActive) {
          return;
        }

        if (shouldListen) {
          set(requiredQueryListenersState, [
            ...currentRequiredQueryListeners,
            { queryId, operationSignature },
          ]);
        } else {
          set(
            requiredQueryListenersState,
            currentRequiredQueryListeners.filter(
              (listener) => listener.queryId !== queryId,
            ),
          );
        }
      },
    [operationSignature],
  );

  useEffect(() => {
    if (isDefined(skip) && skip === true) {
      return;
    }

    changeQueryIdListenState(true, queryId);

    return () => {
      changeQueryIdListenState(false, queryId);
    };
  }, [changeQueryIdListenState, queryId, skip]);
};
