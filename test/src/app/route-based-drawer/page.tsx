'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Drawer } from 'vaul';

export default function Page() {
  const router = useRouter();
  const [snap, setSnap] = useState<number | null | string>(0.4);

  const setActiveSnapPoint = (snap: number | string | null) => {
    if (snap === 0) {
      router.back();
      return;
    }
    setSnap(snap);
  };

  return (
    <div className="w-screen min-h-screen overflow-auto bg-white p-8" vaul-drawer-wrapper="">
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit. Esse cillum dolore eu fugiat nulla pariatur. Neque
        porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Neque porro quisquam
        est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
      </p>
      <p>
        Animi, id est laborum et dolorum fuga. Facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
        Qui officia deserunt mollit anim id est laborum. Animi, id est laborum et dolorum fuga. Eaque ipsa quae ab illo
        inventore veritatis et quasi.
      </p>
      <p>
        Inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nihil molestiae consequatur, vel
        illum qui dolorem eum. Animi, id est laborum et dolorum fuga. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa.
      </p>
      <p>
        Architecto beatae vitae dicta sunt explicabo. Duis aute irure dolor in reprehenderit in voluptate velit. Nemo
        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Qui officia deserunt mollit anim id est
        laborum.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit. Totam rem aperiam. Temporibus autem quibusdam et aut
        officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non
        recusandae.
      </p>
      <p>
        Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam. Itaque earum rerum hic tenetur a sapiente delectus. Quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut enim ad minima veniam, quis nostrum exercitationem
        ullam corporis suscipit laboriosam. Qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem.
      </p>
      <p>
        Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo. Duis aute irure dolor in
        reprehenderit in voluptate velit. Et harum quidem rerum facilis est et expedita distinctio. Lorem ipsum dolor
        sit amet, consectetur adipisicing elit.
      </p>
      <p>
        Eaque ipsa quae ab illo inventore veritatis et quasi. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
        amet, consectetur, adipisci velit. Totam rem aperiam. Animi, id est laborum et dolorum fuga.
      </p>
      <p>
        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
        repudiandae sint et molestiae non recusandae. Et iusto odio dignissimos ducimus qui blanditiis praesentium
        voluptatum deleniti atque.
      </p>
      <p>
        Inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco. Animi, id est laborum et dolorum fuga. Animi, id est laborum et dolorum fuga.
      </p>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco. Temporibus autem quibusdam et aut officiis debitis
        aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
      </p>
      <p>
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Nisi ut aliquid ex
        ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam.
      </p>
      <p>
        Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia. Quia consequuntur magni dolores
        eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
        consectetur, adipisci velit.
      </p>
      <p>
        Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo.
      </p>
      <p>
        Laboris nisi ut aliquip ex ea commodo consequat. Ut aut reiciendis voluptatibus maiores alias consequatur aut
        perferendis doloribus asperiores repellat. Laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p>
        Nihil molestiae consequatur, vel illum qui dolorem eum. Sed ut perspiciatis unde omnis iste natus error sit
        voluptatem. Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate
        velit esse quam.
      </p>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco. Et iusto odio dignissimos ducimus qui blanditiis
        praesentium voluptatum deleniti atque. Facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
      </p>
      <p>
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Ut enim ad minima
        veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Inventore veritatis et quasi architecto
        beatae vitae dicta sunt explicabo.
      </p>
      <p>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa. Corrupti quos dolores et quas molestias excepturi sint occaecati. Quia consequuntur magni dolores
        eos qui ratione voluptatem sequi nesciunt.
      </p>
      <Drawer.Root
        open={true}
        onOpenChange={() => {}}
        snapPoints={[0, 0.4, 1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setActiveSnapPoint}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            data-testid="content"
            className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 outline-none"
          >
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium mb-4">
                  This drawer opens when users navigates to <i>/route-based-drawer</i>
                </Drawer.Title>
                <p>To close drawer just swipe down</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
              <div className="flex gap-6 justify-end max-w-md mx-auto">
                <a
                  className="text-xs text-zinc-600 flex items-center gap-0.25"
                  href="https://github.com/emilkowalski/vaul"
                  target="_blank"
                >
                  GitHub
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    className="w-3 h-3 ml-1"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                  </svg>
                </a>
                <a
                  className="text-xs text-zinc-600 flex items-center gap-0.25"
                  href="https://twitter.com/emilkowalski_"
                  target="_blank"
                >
                  Twitter
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    className="w-3 h-3 ml-1"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                  </svg>
                </a>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
