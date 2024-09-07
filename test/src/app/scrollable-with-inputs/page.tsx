'use client';

import { Drawer } from 'vaul';

export default function Page() {
  return (
    <div className="w-screen h-screen bg-white p-8 flex justify-center items-center" data-vaul-drawer-wrapper="">
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button>Open Drawer</button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[10px]">
            <div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
              <input className="border border-gray-400 my-8" placeholder="Input" />
              <p>
                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born
                and I will give you a complete account of the system, and expound the actual teachings of the great
                explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids
                pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure
                rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or
                pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances
                occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us
                ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any
                right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one
                who avoids a pain that produces no resultant pleasure?
              </p>
              <input className="border border-gray-400 my-8" placeholder="Input" />
              <p>
                On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
                demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the
                pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty
                through weakness of will, which is the same as saying through shrinking from toil and pain. These cases
                are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled
                and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and
                every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of
                business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise
                man therefore always holds in these matters to this principle of selection: he rejects pleasures to
                secure other greater pleasures, or else he endures pains to avoid worse pains.
              </p>
              <input className="border border-gray-400 my-8" placeholder="Input" />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
