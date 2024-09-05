import {
  WorkerMgt,
  WorkerRegistry as WorkerRegistryEvent
} from "../generated/WorkerMgt/WorkerMgt"
import {
  WorkerInfo,
  WorkerCounter
} from "../generated/schema"

const counterName = "WorkerCounter";

export function handleWorkerRegistry(event: WorkerRegistryEvent): void {
    let entity = new WorkerInfo(event.params.workerId);

    let workerMgt = WorkerMgt.bind(event.address);
    let worker = workerMgt.getWorkerById(event.params.workerId);
    entity.workerType = worker.workerType;
    entity.name = worker.name;
    entity.desc = worker.desc;
    entity.stakeAmount = worker.stakeAmount;
    entity.owner = worker.owner;
    entity.publicKey = worker.publicKey;
    entity.time = worker.time;
    entity.status = worker.status;
    entity.sucTasksAmount = worker.sucTasksAmount;
    entity.failTasksAmount = worker.failTasksAmount;
    entity.delegationAmount = worker.delegationAmount;

    entity.save();

    // update worker count
    increaseWorkerCount();
}

function increaseWorkerCount(): void {
    let workerCounter = WorkerCounter.load(counterName);
    if (workerCounter === null) {
        workerCounter = new WorkerCounter(counterName);
        workerCounter.workerCount = 0;
    }

    workerCounter.workerCount += 1;
    workerCounter.save();
}
