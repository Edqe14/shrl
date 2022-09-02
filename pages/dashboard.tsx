import { Shorted } from '@prisma/client';
import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';
import { BiCopyAlt, BiLinkExternal, BiPencil, BiTrashAlt } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { toast } from 'react-toastify';
import ErrorAlert from '@/components/ErrorAlert';

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

export default function Dashboard() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyError, setKeyError] = useState(false);
  const [open, setOpen] = useState(true);
  const [all, setAll] = useState<Shorted[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.defaults.headers.common.authorization = `Bearer ${apiKey ?? ''}`;
  }, [apiKey]);

  const updateList = async () => {
    if (!apiKey) return setKeyError(true);

    try {
      const res = await axios.get('/api/short');

      if (open) setOpen(false);

      setAll(res.data.data);
    } catch (e) {
      setKeyError(true);
    }
  };

  const deleteItem = (id: string) => async () => {
    await axios.delete(`/api/short/${id}`);
    await updateList();

    toast('Item deleted', {
      type: 'success'
    });
  };

  const createNew: FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();

    try {
      const data = Object.fromEntries(new FormData(ev.target as unknown as HTMLFormElement).entries());
      await axios.post('/api/short', data);
      await updateList();

      (ev.target as HTMLFormElement).reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast(e?.response?.data?.message, {
        type: 'error'
      });
    }
  };

  return (
    <main className="p-16">
      <section className="flex justify-between items-center mb-6">
        {/* Copy API Key */}
        <section>
          <label className="input-group">
            <input type="password" className="input input-ghost" disabled value={apiKey ?? ''} />
            <span className={`cursor-pointer ${copied && 'bg-green-500 text-slate-900'} transition-colors duration-200 ease-in-out`} onClick={async () => {
              if (copied) return;

              await copyToClipboard(apiKey as string);

              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            }}>
              <BiCopyAlt size={18} />
            </span>
          </label>
        </section>

        <form onSubmit={createNew} className="flex gap-6">
          <label className="input-group justify-end">
            <input name="name" type="text" placeholder="Name" className="input input-bordered" title="Leave empty to randomly generate" />
            <input name="url" type="url" placeholder="Destination" required className="input input-bordered" />
          </label>

          <button className="btn btn-primary">
            <AiOutlinePlus />
          </button>
        </form>
      </section>

      {/* Modal */}
      <div className={`modal ${open && 'modal-open'}`}>
        <form className="modal-box" onSubmit={(ev) => { ev.preventDefault(); updateList(); }}>
          <h3 className="font-extrabold text-lg">Please input your auth token</h3>

          <input type="password" placeholder="API Key" className={`input mt-4 w-full bg-base-200 ${keyError && 'input-error'}`} onChange={(ev) => {
            setApiKey(ev.target.value);
            if (keyError) setKeyError(false);
          }} value={apiKey ?? ''} />

          {keyError && (<ErrorAlert value="Invalid API Key" />)}

          <div className="modal-action">
            <button type="submit" className="btn">Continue</button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto hover:drop-shadow-lg transition-all duration-200 ease-in-out">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Destination</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              all.map((v, i) => (
                <tr key={v.id}>
                  <th>{i + 1}</th>

                  <td className="group">
                    <span className="flex items-center justify-between gap-4">
                      <p>{v.name}</p>

                      <section className="invisible group-hover:visible">
                        <a href={v.name} target="_blank" rel="noreferrer">
                          <BiLinkExternal className="cursor-pointer hover:text-secondary transition-colors duration-200 ease-in-out" size={18} />
                        </a>
                      </section>
                    </span>
                  </td>

                  <td>
                    <a href={v.url} className="text-accent" rel="noreferrer" target="_blank">{v.url}</a>
                  </td>

                  <td className="flex gap-3 justify-end">
                    {/* <button className="btn btn-warning">
                      <BiPencil size={18} />
                    </button> */}

                    <button className="btn btn-error" onClick={deleteItem(v.id)}>
                      <BiTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </main>
  );
}