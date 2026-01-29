import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useListenToObjectRecordEventsForQuery } from '@/sse-db-event/hooks/useListenToObjectRecordEventsForQuery';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { workflowVisualizerWorkflowVersionIdComponentState } from '@/workflow/states/workflowVisualizerWorkflowVersionIdComponentState';
import { isDefined } from 'twenty-shared/utils';

export const WorkflowSSESubscribeEffect = () => {
  const workflowVersionId = useRecoilComponentValue(
    workflowVisualizerWorkflowVersionIdComponentState,
  );

  const queryId = `workflow-version-${workflowVersionId}`;

  useListenToObjectRecordEventsForQuery({
    queryId,
    operationSignature: {
      objectNameSingular: CoreObjectNameSingular.WorkflowVersion,
      variables: {
        filter: {
          id: { eq: workflowVersionId ?? '' },
        },
      },
    },
    skip: !isDefined(workflowVersionId),
  });

  return null;
};
