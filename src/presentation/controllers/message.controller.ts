import { IDependency } from '@application/ports/IDependency';
import messageUseCase from '@application/use-cases/message.use-cse';

const messageControllerCreate = (dependencies: IDependency) => {
  const {
    get,
  } = messageUseCase();

  const getController = async (req: any, res: any, next: any) => {
    try {
      const interval = req.query?.i;
      await get(interval);
      return res.status(200).json({
        status: 'success',
        data: {}
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

export default messageControllerCreate;