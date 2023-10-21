import { IDependency } from '@application/ports/IDependency';
import transactionUseCase from '@application/use-cases/transaction.use-cse';

const transactionControllerCreate = (dependencies: IDependency) => {
  const {
    get,
  } = transactionUseCase();

  const getController = async (req: any, res: any, next: any) => {
    try {
      const interval = req.query?.i;
      const {trancations}= await get(interval);
      return res.status(200).json({
        status: 'success',
        data: trancations
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    getController,
  }
}

export default transactionControllerCreate;